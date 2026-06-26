package com.sam.doctorapp.appointment.service;

import com.sam.doctorapp.appointment.client.DoctorServiceClient;
import com.sam.doctorapp.appointment.client.NotificationServiceClient;
import com.sam.doctorapp.appointment.client.UserServiceClient;
import com.sam.doctorapp.appointment.dto.AppointmentRequestDTO;
import com.sam.doctorapp.appointment.dto.AppointmentResponseDTO;
import com.sam.doctorapp.appointment.dto.NotificationRequestDTO;
import com.sam.doctorapp.appointment.kafka.AppointmentEventPublisher;
import com.sam.doctorapp.appointment.mapper.AppointmentMapper;
import com.sam.doctorapp.appointment.model.Appointment;
import com.sam.doctorapp.appointment.repository.AppointmentRepository;
import com.sam.doctorapp.appointment.specification.AppointmentSpecification;
import com.sam.doctorapp.common.enums.AppointmentStatus;
import com.sam.doctorapp.common.event.EventType;
import com.sam.doctorapp.common.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentServiceImpl.class);
    private final AppointmentRepository appointmentRepository;
    private final DoctorServiceClient doctorServiceClient;
    private final UserServiceClient userServiceClient;
    private final NotificationServiceClient notificationServiceClient;
    private final AppointmentEventPublisher eventPublisher;

    @Override
    @Transactional
    @CacheEvict(value = "appointments", allEntries = true)
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {
        logger.info("Booking appointment: doctor={}, patient={}, date={}", dto.getDoctorId(), dto.getPatientId(), dto.getAppointmentDate());

        LocalDateTime normalizedTime = dto.getAppointmentDate().withSecond(0).withNano(0);
        LocalDate date = normalizedTime.toLocalDate();
        LocalTime startTime = normalizedTime.toLocalTime();

        Map<String, Object> availability = doctorServiceClient.checkSlotAvailability(dto.getDoctorId(), date, startTime);
        Object fallback = availability.get("fallback");
        if (Boolean.TRUE.equals(fallback)) {
            logger.warn("Doctor service unavailable, proceeding without slot check");
        } else if (!Boolean.TRUE.equals(availability.get("data"))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This slot is not available. Please pick another time.");
        }

        try {
            Appointment appointment = new Appointment();
            appointment.setDoctorId(dto.getDoctorId());
            appointment.setPatientId(dto.getPatientId());
            appointment.setAppointmentDate(normalizedTime);
            appointment.setReason(dto.getReason());
            appointment.setStatus(AppointmentStatus.BOOKED);
            appointment.setUpdatedAt(LocalDateTime.now());

            Appointment saved = appointmentRepository.saveAndFlush(appointment);

            doctorServiceClient.markSlotBooked(dto.getDoctorId(), date, startTime);

            Map<String, Object> doctorData = doctorServiceClient.getDoctorById(dto.getDoctorId());
            String doctorName = doctorData != null && doctorData.get("data") instanceof Map
                    ? (String) ((Map<?, ?>) doctorData.get("data")).get("name") : "Doctor";
            Map<String, Object> userData = userServiceClient.getUserById(dto.getPatientId());
            String patientName = userData != null && userData.get("data") instanceof Map
                    ? (String) ((Map<?, ?>) userData.get("data")).get("name") : "Patient";
            String patientEmail = userData != null && userData.get("data") instanceof Map
                    ? (String) ((Map<?, ?>) userData.get("data")).get("email") : "";

            eventPublisher.publishAppointmentEvent(
                    EventType.APPOINTMENT_BOOKED, saved.getId(), dto.getDoctorId(), dto.getPatientId(),
                    patientName, patientEmail, doctorName, normalizedTime, dto.getReason()
            );

            try {
                NotificationRequestDTO notif = new NotificationRequestDTO();
                notif.setUserId(dto.getPatientId());
                notif.setAppointmentId(saved.getId());
                notif.setMessage("Appointment booked successfully with " + doctorName);
                notificationServiceClient.createNotification(notif);
            } catch (Exception e) {
                logger.warn("Feign notification failed: {}", e.getMessage());
            }

            return AppointmentMapper.toDTO(saved);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This slot is already booked.");
        }
    }

    @Override
    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream().map(AppointmentMapper::toDTO).toList();
    }

    @Override
    public AppointmentResponseDTO getAppointmentById(Long id) {
        return AppointmentMapper.toDTO(appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found")));
    }

    @Override
    public List<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream().map(AppointmentMapper::toDTO).toList();
    }

    @Override
    public List<AppointmentResponseDTO> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream().map(AppointmentMapper::toDTO).toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = "appointments", allEntries = true)
    public AppointmentResponseDTO cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Appointment is already cancelled");
        }
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setUpdatedAt(LocalDateTime.now());
        Appointment saved = appointmentRepository.save(appointment);

        LocalDate date = saved.getAppointmentDate().toLocalDate();
        LocalTime startTime = saved.getAppointmentDate().toLocalTime();
        doctorServiceClient.markSlotUnbooked(saved.getDoctorId(), date, startTime);

        eventPublisher.publishAppointmentEvent(
                EventType.APPOINTMENT_CANCELLED, saved.getId(), saved.getDoctorId(), saved.getPatientId(),
                "", "", "", saved.getAppointmentDate(), saved.getReason()
        );

        logger.info("Appointment {} cancelled", id);
        return AppointmentMapper.toDTO(saved);
    }

    @Override
    @Cacheable(value = "appointments", key = "'page_' + #page + '_' + #size")
    public Page<AppointmentResponseDTO> getAllAppointment(int page, int size) {
        return appointmentRepository.findAll(PageRequest.of(page, size)).map(AppointmentMapper::toDTO);
    }

    @Override
    @Transactional
    @CacheEvict(value = "appointments", allEntries = true)
    public AppointmentResponseDTO completeAppointment(Long id, String prescription) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (prescription == null || prescription.trim().isEmpty()) {
            throw new RuntimeException("Prescription is required");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setPrescription(prescription);
        appointment.setUpdatedAt(LocalDateTime.now());
        Appointment saved = appointmentRepository.save(appointment);

        eventPublisher.publishAppointmentEvent(
                EventType.APPOINTMENT_COMPLETED, saved.getId(), saved.getDoctorId(), saved.getPatientId(),
                "", "", "", saved.getAppointmentDate(), saved.getReason()
        );

        return AppointmentMapper.toDTO(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "appointments", allEntries = true)
    public AppointmentResponseDTO updateAppointment(Long id, AppointmentRequestDTO dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new RuntimeException("Cannot modify a completed or cancelled appointment");
        }

        if (dto.getReason() != null) appointment.setReason(dto.getReason());
        if (dto.getPrescription() != null) appointment.setPrescription(dto.getPrescription());
        if (dto.getAppointmentDate() != null) {
            appointment.setAppointmentDate(dto.getAppointmentDate());
        }

        return AppointmentMapper.toDTO(appointmentRepository.save(appointment));
    }

    @Override
    @Transactional
    @CacheEvict(value = "appointments", allEntries = true)
    public AppointmentResponseDTO updateStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        appointment.setStatus(status);
        return AppointmentMapper.toDTO(appointmentRepository.save(appointment));
    }

    @Override
    public Page<AppointmentResponseDTO> searchAppointments(Long doctorId, Long patientId, AppointmentStatus status, LocalDate date, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Appointment> spec = Specification
                .where(AppointmentSpecification.hasDoctorId(doctorId))
                .and(AppointmentSpecification.hasPatientId(patientId))
                .and(AppointmentSpecification.hasStatus(status))
                .and(AppointmentSpecification.hasDate(date));
        return appointmentRepository.findAll(spec, pageable).map(AppointmentMapper::toDTO);
    }
}
