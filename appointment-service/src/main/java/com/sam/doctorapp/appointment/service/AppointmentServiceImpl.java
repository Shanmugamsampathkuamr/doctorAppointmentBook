package com.sam.doctorapp.appointment.service;

import com.sam.doctorapp.appointment.client.DoctorServiceClient;
import com.sam.doctorapp.appointment.client.NotificationServiceClient;
import com.sam.doctorapp.appointment.client.UserServiceClient;
import com.sam.doctorapp.appointment.dto.AppointmentRequestDTO;
import com.sam.doctorapp.appointment.dto.AppointmentResponseDTO;
import com.sam.doctorapp.appointment.dto.NotificationRequestDTO;
import com.sam.doctorapp.appointment.mapper.AppointmentMapper;
import com.sam.doctorapp.appointment.model.Appointment;
import com.sam.doctorapp.appointment.repository.AppointmentRepository;
import com.sam.doctorapp.appointment.specification.AppointmentSpecification;
import com.sam.doctorapp.common.enums.AppointmentStatus;
import com.sam.doctorapp.common.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentServiceImpl.class);
    private final AppointmentRepository appointmentRepository;
    private final DoctorServiceClient doctorServiceClient;
    private final UserServiceClient userServiceClient;
    private final NotificationServiceClient notificationServiceClient;

    @Override
    @Transactional
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {
        logger.info("Booking appointment: doctor={}, patient={}, date={}", dto.getDoctorId(), dto.getPatientId(), dto.getAppointmentDate());

        try {
            Appointment appointment = new Appointment();
            appointment.setDoctorId(dto.getDoctorId());
            appointment.setPatientId(dto.getPatientId());
            LocalDateTime normalizedTime = dto.getAppointmentDate().withSecond(0).withNano(0);
            appointment.setAppointmentDate(normalizedTime);
            appointment.setReason(dto.getReason());
            appointment.setStatus(AppointmentStatus.BOOKED);
            appointment.setUpdatedAt(LocalDateTime.now());

            Appointment saved = appointmentRepository.saveAndFlush(appointment);

            try {
                NotificationRequestDTO notif = new NotificationRequestDTO();
                notif.setUserId(dto.getPatientId());
                notif.setAppointmentId(saved.getId());
                notif.setMessage("Appointment booked successfully");
                notificationServiceClient.createNotification(notif);
            } catch (Exception e) {
                logger.warn("Notification failed: {}", e.getMessage());
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
    public AppointmentResponseDTO cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment saved = appointmentRepository.save(appointment);
        logger.info("Appointment {} cancelled", id);
        return AppointmentMapper.toDTO(saved);
    }

    @Override
    public Page<AppointmentResponseDTO> getAllAppointment(int page, int size) {
        return appointmentRepository.findAll(PageRequest.of(page, size)).map(AppointmentMapper::toDTO);
    }

    @Override
    @Transactional
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
        return AppointmentMapper.toDTO(saved);
    }

    @Override
    @Transactional
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
