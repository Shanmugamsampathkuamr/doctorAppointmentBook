package com.sam.doctorapp.service.appoinment;

import com.sam.doctorapp.dto.appoinment.AppointmentRequestDTO;
import com.sam.doctorapp.dto.appoinment.AppointmentResponseDTO;
import com.sam.doctorapp.dto.notification.NotificationRequestDTO;
import com.sam.doctorapp.enums.AppointmentStatus;
import com.sam.doctorapp.exception.ResourceNotFoundException;
import com.sam.doctorapp.mapper.AppointmentMapper;
import com.sam.doctorapp.model.*;
import com.sam.doctorapp.repository.AppointmentRepository;
import com.sam.doctorapp.repository.DoctorAviailabilityRepository;
import com.sam.doctorapp.repository.DoctorRepository;
import com.sam.doctorapp.repository.UserRepository;
import com.sam.doctorapp.service.notification.NotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.sam.doctorapp.specification.AppointmentSpecification;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private static  final Logger logger = LoggerFactory.getLogger(AppointmentServiceImpl.class);

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final DoctorAviailabilityRepository doctorAviailabilityRepository;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;

    // book appointment //

    @Override
    @Transactional
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {
        logger.info("Initiating booking for Doctor ID: {} and Patient ID: {} at {}",
                dto.getDoctorId(), dto.getPatientId(), dto.getAppointmentDate());

        // 1. Basic Existence Checks
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        User patient = userRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        // 2. Availability Slot Check
        DoctorAvailability availability = doctorAviailabilityRepository
                .findByDoctorIdAndAvailableDateAndStartTime(
                        dto.getDoctorId(),
                        dto.getAppointmentDate().toLocalDate(),
                        dto.getAppointmentDate().toLocalTime()
                )
                .orElseThrow(() -> new RuntimeException("This time slot is not offered by the doctor."));

        if (availability.getIsBooked()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This slot is no longer available.");
        }

        try {
            // 3. NORMALIZE & SAVE
            Appointment appointment = new Appointment();
            appointment.setDoctor(doctor);
            appointment.setPatient(patient);

            // Truncate to minutes to ensure the UniqueConstraint catches exact matches
            LocalDateTime normalizedTime = dto.getAppointmentDate().withSecond(0).withNano(0);
            appointment.setAppointmentDate(normalizedTime);

            appointment.setReason(dto.getReason());
            appointment.setStatus(AppointmentStatus.BOOKED);
            appointment.setUpdatedAt(LocalDateTime.now()); // Initialize timestamp

            // DATABASE RACE CONDITION CHECK HAPPENS HERE
            Appointment savedAppointment = appointmentRepository.saveAndFlush(appointment);

            // 4. MARK SLOT AS TAKEN
            availability.setIsBooked(true);
            doctorAviailabilityRepository.save(availability);

            // 5. NOTIFICATION LOGIC
            // Wrapped in try-catch so an email failure doesn't roll back the booking
            try {
                sendBookingNotification(patient, doctor, savedAppointment);
            } catch (Exception e) {
                logger.warn("Booking saved but notification failed: {}", e.getMessage());
            }

            return AppointmentMapper.toDTO(savedAppointment);

        } catch (DataIntegrityViolationException e) {
            logger.error("Concurrency Conflict: Slot taken for doctor {} at {}",
                    dto.getDoctorId(), dto.getAppointmentDate());
            // Return 409 Conflict so React knows exactly what happened
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Someone else just booked this slot.");
        }
    }


    // GetallApoointment //


    @Override
    public List<AppointmentResponseDTO> getAllAppointments() {

        logger.info("fetching all appointment");

        List<AppointmentResponseDTO> appointment=appointmentRepository.findAll()
                .stream()
                .map(AppointmentMapper::toDTO)
                .toList();

        logger.info("Total Appointment fetched:{}",appointment.size());

        return appointment;
    }




    //get appointment with by id//


    @Override
    public AppointmentResponseDTO getAppointmentById(Long id) {

        logger.info("fetching appointment with id:{}", id);

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> {
                logger.error("Appointment not found with id:{}",id);
        return new ResourceNotFoundException("Appointment not found");
    });

        logger.info("Appointment fetched with id:{}",id);

        return AppointmentMapper.toDTO(appointment);
    }


    //  get appoinmentByDoctorid//

    @Override
    public List<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorId) {


        logger.info("fetching appointment with doctor id:{} ",doctorId);

        List<AppointmentResponseDTO> appointment = appointmentRepository.findByDoctorId(doctorId)
                .stream()
                .map(AppointmentMapper::toDTO)
                .toList();

        logger.info("Total Appointment fetched by doctor:{}",appointment.size());

        return appointment;
    }

    // getAppointmentby patient//


    @Override
    public List<AppointmentResponseDTO> getAppointmentsByPatient(Long patientId) {

        logger.info("Fetch Appointment By PatientId :{}",patientId);

        List<AppointmentResponseDTO> appointment= appointmentRepository.findByPatientId(patientId)
                .stream()
                .map(AppointmentMapper::toDTO)
                .toList();

        logger.info("Total Appointment fetched by patientId:{}",appointment.size());

        return appointment;
    }




    // cancel appoinment //


    @Override
    @Transactional
    public AppointmentResponseDTO cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment saved = appointmentRepository.save(appointment);

        // Use your new helper method here!
        freeAvailabilitySlot(appointment);

        logger.info("Appointment canceled and slot freed for id: {}", id);
        return AppointmentMapper.toDTO(saved);
    }
    // get allappointment by page and size//

    @Override
    public Page<AppointmentResponseDTO> getAllAppointment(int page, int size) {

        logger.info("fetching appointment with pagination page:{}, size:{}",page,size);
        Pageable pageable = PageRequest.of(page,size);

        return appointmentRepository.findAll(pageable)
                .map(AppointmentMapper::toDTO);
    }


    // complete appointment //

    @Override
    @Transactional
    public AppointmentResponseDTO completeAppointment(Long id, String prescription) {
        logger.info("Attempting to complete appointment ID: {}", id);

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (prescription == null || prescription.trim().isEmpty()) {
            logger.warn("Validation failed: Prescription is empty for appointment {}", id);
            throw new RuntimeException("Medical notes/prescription are required to complete the visit.");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setPrescription(prescription);

        // --- CRITICAL ADDITION FOR CHAT SYSTEM ---
        appointment.setUpdatedAt(LocalDateTime.now());
        // This starts the 24-hour clock for follow-up chats!

        Appointment saved = appointmentRepository.save(appointment);

        try {
            NotificationRequestDTO notifDto = new NotificationRequestDTO();
            notifDto.setUserId(appointment.getPatient().getId());
            notifDto.setAppointmentId(appointment.getId());
            notifDto.setMessage("Dr. " + appointment.getDoctor().getName() + " finalized your visit. Check your history for the prescription.");

            notificationService.createNotification(notifDto);
            logger.info("Notification triggered for patient ID: {}", appointment.getPatient().getId());
        } catch (Exception e) {
            logger.error("Notification failed but appointment saved: {}", e.getMessage());
        }

        logger.info("Appointment {} completed with notes.", id);
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

        // 1. Update Reason (New!)
        if (dto.getReason() != null) {
            appointment.setReason(dto.getReason());
        }

        // 2. Update Prescription (Only if the doctor is editing during/after visit)
        if (dto.getPrescription() != null) {
            appointment.setPrescription(dto.getPrescription());
        }

        // 3. Handle Date Change
        if (dto.getAppointmentDate() != null && !dto.getAppointmentDate().equals(appointment.getAppointmentDate())) {

            DoctorAvailability newSlot = doctorAviailabilityRepository.findByDoctorIdAndAvailableDateAndStartTime(
                    appointment.getDoctor().getId(),
                    dto.getAppointmentDate().toLocalDate(),
                    dto.getAppointmentDate().toLocalTime()
            ).orElseThrow(() -> new RuntimeException("Doctor is not available at the new requested time"));

            if (newSlot.getIsBooked()) {
                throw new RuntimeException("The new time slot is already booked by someone else");
            }

            freeAvailabilitySlot(appointment); // Release old
            appointment.setAppointmentDate(dto.getAppointmentDate()); // Set new
            occupyAvailabilitySlot(appointment); // Lock new
        }

        return AppointmentMapper.toDTO(appointmentRepository.save(appointment));
    }
    // search//
    @Override
    public Page<AppointmentResponseDTO> searchAppointments(Long doctorId, Long patientId, AppointmentStatus status, LocalDate date, int page, int size){
        logger.info("Searching appointments doctorId:{} patientId:{} status:{} date:{}",doctorId,patientId,status,date,page,size);

        Pageable pageable = PageRequest.of(page,size);

        Specification<Appointment> spec = Specification
                .where(AppointmentSpecification.hasDoctorId(doctorId))
                .and(AppointmentSpecification.hasPatientId(patientId))
                .and(AppointmentSpecification.hasStatus(status))
                .and(AppointmentSpecification.hasDate(date));


        Page<Appointment> result = appointmentRepository.findAll(spec,pageable);
        logger.info("Total appointment fount:{}",result.getTotalElements());
        return result.map(AppointmentMapper::toDTO);
    }


    @Override
    @Transactional
    public AppointmentResponseDTO updateStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        AppointmentStatus oldStatus = appointment.getStatus();

        // Logic: If moving TO a 'released' state from an 'occupied' state
        if ((status == AppointmentStatus.CANCELLED || status == AppointmentStatus.REJECTED)
                && oldStatus != AppointmentStatus.CANCELLED && oldStatus != AppointmentStatus.REJECTED) {
            freeAvailabilitySlot(appointment);
        }

        // Logic: If moving FROM a 'released' state back to 'BOOKED' or 'CONFIRMED'
        else if ((status == AppointmentStatus.BOOKED || status == AppointmentStatus.CONFIRMED)
                && (oldStatus == AppointmentStatus.CANCELLED || oldStatus == AppointmentStatus.REJECTED)) {
            occupyAvailabilitySlot(appointment);
        }

        appointment.setStatus(status);
        Appointment updated = appointmentRepository.save(appointment);

        // Notify Patient of the decision
        sendDecisionNotification(appointment, status);

        logger.info("Appointment {} status changed from {} to {}", id, oldStatus, status);
        return AppointmentMapper.toDTO(updated);
    }

    private void sendDecisionNotification(Appointment appointment, AppointmentStatus status) {
        String message = switch (status) {
            case CONFIRMED -> "Great news! Dr. " + appointment.getDoctor().getName() + " has confirmed your appointment.";
            case REJECTED -> "We're sorry, your appointment request with Dr. " + appointment.getDoctor().getName() + " was declined.";
            case CANCELLED -> "Your appointment has been successfully cancelled.";
            default -> "Your appointment status has been updated to: " + status;
        };

        // Reuse your existing notification logic
        NotificationRequestDTO notif = new NotificationRequestDTO();
        notif.setUserId(appointment.getPatient().getId());
        notif.setAppointmentId(appointment.getId());
        notif.setMessage(message);
        notificationService.createNotification(notif);
    }

    private void freeAvailabilitySlot(Appointment appointment) {
        doctorAviailabilityRepository.findByDoctorIdAndAvailableDateAndStartTime(
                appointment.getDoctor().getId(),
                appointment.getAppointmentDate().toLocalDate(),
                appointment.getAppointmentDate().toLocalTime()
        ).ifPresent(availability -> {
            availability.setIsBooked(false);
            doctorAviailabilityRepository.save(availability);
        });
    }
    private void occupyAvailabilitySlot(Appointment appointment) {
        doctorAviailabilityRepository.findByDoctorIdAndAvailableDateAndStartTime(
                appointment.getDoctor().getId(),
                appointment.getAppointmentDate().toLocalDate(),
                appointment.getAppointmentDate().toLocalTime()
        ).ifPresent(availability -> {
            availability.setIsBooked(true); // Lock the slot
            doctorAviailabilityRepository.save(availability);
        });
    }

    private void sendBookingNotification(User patient, Doctor doctor, Appointment savedAppointment) {
        try {
            NotificationRequestDTO notification = new NotificationRequestDTO();
            notification.setUserId(patient.getId());
            notification.setAppointmentId(savedAppointment.getId());
            notification.setMessage("Success! Your appointment with Dr. " + doctor.getName() +
                    " is confirmed for " + savedAppointment.getAppointmentDate());

            notificationService.createNotification(notification);
            logger.info("Notification successfully triggered for Patient ID: {}", patient.getId());
        } catch (Exception e) {
            // We log the error but don't throw it, so the booking remains saved
            // even if the notification system has a small hiccup.
            logger.warn("Appointment saved but notification failed: {}", e.getMessage());
        }
    }
}
