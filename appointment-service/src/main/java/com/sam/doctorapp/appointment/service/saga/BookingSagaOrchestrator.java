package com.sam.doctorapp.appointment.service.saga;

import com.sam.doctorapp.appointment.client.DoctorServiceClient;
import com.sam.doctorapp.appointment.client.NotificationServiceClient;
import com.sam.doctorapp.appointment.client.UserServiceClient;
import com.sam.doctorapp.appointment.dto.NotificationRequestDTO;
import com.sam.doctorapp.appointment.kafka.AppointmentEventPublisher;
import com.sam.doctorapp.appointment.mapper.AppointmentMapper;
import com.sam.doctorapp.appointment.model.Appointment;
import com.sam.doctorapp.appointment.model.SagaState;
import com.sam.doctorapp.appointment.repository.AppointmentRepository;
import com.sam.doctorapp.appointment.repository.SagaStateRepository;
import com.sam.doctorapp.common.enums.AppointmentStatus;
import com.sam.doctorapp.common.event.EventType;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Map;
import java.util.UUID;

import static com.sam.doctorapp.appointment.service.saga.SagaConstants.*;

@Service
@RequiredArgsConstructor
public class BookingSagaOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(BookingSagaOrchestrator.class);

    private final AppointmentRepository appointmentRepository;
    private final SagaStateRepository sagaStateRepository;
    private final DoctorServiceClient doctorServiceClient;
    private final UserServiceClient userServiceClient;
    private final NotificationServiceClient notificationServiceClient;
    private final AppointmentEventPublisher eventPublisher;
    private final EntityManager entityManager;

    @Transactional
    public Appointment bookAppointmentSaga(Long doctorId, Long patientId, LocalDateTime appointmentDate, String reason) {
        String sagaId = UUID.randomUUID().toString();
        log.info("Booking saga started: sagaId={}, doctor={}, patient={}, time={}", sagaId, doctorId, patientId, appointmentDate);

        LocalDateTime normalizedTime = appointmentDate.withSecond(0).withNano(0);
        LocalDate date = normalizedTime.toLocalDate();
        LocalTime startTime = normalizedTime.toLocalTime();

        // Step 1: Create appointment as PENDING
        Appointment appointment = new Appointment();
        appointment.setDoctorId(doctorId);
        appointment.setPatientId(patientId);
        appointment.setAppointmentDate(normalizedTime);
        appointment.setReason(reason);
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setUpdatedAt(LocalDateTime.now());

        SagaState saga = createSagaState(sagaId, SAGA_TYPE_BOOKING, appointment);
        saga.setStep(STEP_STARTED);
        sagaStateRepository.save(saga);

        try {
            appointment = appointmentRepository.saveAndFlush(appointment);
            saga.setStep(STEP_SLOT_CHECKED);
            saga.setAppointmentId(appointment.getId());
            sagaStateRepository.save(saga);

            // Step 2: Check slot availability
            Map<String, Object> availability = doctorServiceClient.checkSlotAvailability(doctorId, date, startTime);
            Object fallback = availability.get("fallback");
            boolean slotAvailable;
            if (Boolean.TRUE.equals(fallback)) {
                log.warn("Doctor service unavailable for slot check, proceeding optimistically");
                slotAvailable = true;
            } else {
                slotAvailable = Boolean.TRUE.equals(availability.get("data"));
            }

            if (!slotAvailable) {
                log.warn("Slot not available: doctor={}, date={}, time={}", doctorId, date, startTime);
                compensateBooking(saga, appointment, "Slot not available");
                throw new RuntimeException("This slot is not available. Please pick another time.");
            }

            // Step 3: Book the slot in doctor-service
            saga.setStep(STEP_SLOT_BOOKED);
            sagaStateRepository.save(saga);

            Map<String, Object> bookResult = doctorServiceClient.markSlotBooked(doctorId, date, startTime);
            Object bookFallback = bookResult.get("fallback");
            if (Boolean.TRUE.equals(bookFallback)) {
                log.warn("Doctor service unavailable for slot booking, proceeding optimistically");
            } else if (!Boolean.TRUE.equals(bookResult.get("data")) && !Boolean.TRUE.equals(bookResult.get("success"))) {
                compensateBooking(saga, appointment, "Slot booking failed in doctor service");
                throw new DataIntegrityViolationException("Slot booking failed in doctor service");
            }

            // Step 4: Fetch doctor and patient info for notification
            saga.setStep(STEP_NOTIFICATION);
            sagaStateRepository.save(saga);

            String doctorName = fetchDoctorName(doctorId);
            String patientName = fetchPatientName(patientId);
            String patientEmail = fetchPatientEmail(patientId);

            // Step 5: Mark appointment BOOKED and complete saga
            String finalDoctorName = doctorName;
            String finalPatientName = patientName;
            String finalPatientEmail = patientEmail;

            appointment.setStatus(AppointmentStatus.BOOKED);
            appointment.setUpdatedAt(LocalDateTime.now());
            appointment = appointmentRepository.save(appointment);

            saga.setStep(STEP_DONE);
            saga.setStatus(STATUS_COMPLETED);
            sagaStateRepository.save(saga);

            // Non-critical: send notifications
            sendNotifications(sagaId, appointment, doctorId, patientId, finalDoctorName, finalPatientName, finalPatientEmail, reason, normalizedTime);

            log.info("Booking saga completed successfully: sagaId={}, appointmentId={}", sagaId, appointment.getId());
            return appointment;

        } catch (DataIntegrityViolationException e) {
            log.error("Booking saga failed with data integrity violation: sagaId={}", sagaId, e);
            compensateBooking(saga, appointment, e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Slot not available")) {
                throw e;
            }
            log.error("Booking saga failed unexpectedly: sagaId={}", sagaId, e);
            compensateBooking(saga, appointment, e.getMessage());
            throw new RuntimeException("Booking failed: " + e.getMessage(), e);
        }
    }

    private void compensateBooking(SagaState saga, Appointment appointment, String error) {
        log.warn("Compensating booking saga: sagaId={}, error={}", saga.getSagaId(), error);
        try {
            saga.setStatus(STATUS_COMPENSATING);
            saga.setErrorMessage(error);
            sagaStateRepository.save(saga);

            if (appointment != null && appointment.getId() != null) {
                Appointment managedAppointment = entityManager.find(Appointment.class, appointment.getId());
                if (managedAppointment != null) {
                    managedAppointment.setStatus(AppointmentStatus.CANCELLED);
                    managedAppointment.setUpdatedAt(LocalDateTime.now());
                    entityManager.merge(managedAppointment);

                    LocalDate date = managedAppointment.getAppointmentDate().toLocalDate();
                    LocalTime startTime = managedAppointment.getAppointmentDate().toLocalTime();

                    try {
                        doctorServiceClient.markSlotUnbooked(managedAppointment.getDoctorId(), date, startTime);
                    } catch (Exception unbookErr) {
                        log.warn("Failed to unbook slot during compensation: {}", unbookErr.getMessage());
                    }
                }
            }

            saga.setStatus(STATUS_COMPENSATED);
            saga.setStep(STEP_COMPENSATED);
            sagaStateRepository.save(saga);
        } catch (Exception compErr) {
            log.error("Compensation failed for saga: sagaId={}", saga.getSagaId(), compErr);
            saga.setStatus(STATUS_FAILED);
            sagaStateRepository.save(saga);
        }
    }

    private SagaState createSagaState(String sagaId, String type, Appointment appointment) {
        SagaState saga = new SagaState();
        saga.setSagaId(sagaId);
        saga.setSagaType(type);
        saga.setStep(STEP_STARTED);
        saga.setStatus(STATUS_IN_PROGRESS);
        saga.setAppointmentId(appointment.getId());
        saga.setPayload(String.format("{\"doctorId\":%d,\"patientId\":%d,\"time\":\"%s\"}",
                appointment.getDoctorId(), appointment.getPatientId(), appointment.getAppointmentDate()));
        return saga;
    }

    private String fetchDoctorName(Long doctorId) {
        try {
            Map<String, Object> data = doctorServiceClient.getDoctorById(doctorId);
            if (data != null && data.get("data") instanceof Map) {
                Object name = ((Map<?, ?>) data.get("data")).get("name");
                return name != null ? name.toString() : "Doctor";
            }
        } catch (Exception e) {
            log.warn("Failed to fetch doctor name: {}", e.getMessage());
        }
        return "Doctor";
    }

    private String fetchPatientName(Long patientId) {
        try {
            Map<String, Object> data = userServiceClient.getUserById(patientId);
            if (data != null && data.get("data") instanceof Map) {
                Object name = ((Map<?, ?>) data.get("data")).get("name");
                return name != null ? name.toString() : "Patient";
            }
        } catch (Exception e) {
            log.warn("Failed to fetch patient name: {}", e.getMessage());
        }
        return "Patient";
    }

    private String fetchPatientEmail(Long patientId) {
        try {
            Map<String, Object> data = userServiceClient.getUserById(patientId);
            if (data != null && data.get("data") instanceof Map) {
                Object email = ((Map<?, ?>) data.get("data")).get("email");
                return email != null ? email.toString() : "";
            }
        } catch (Exception e) {
            log.warn("Failed to fetch patient email: {}", e.getMessage());
        }
        return "";
    }

    private void sendNotifications(String sagaId, Appointment appointment, Long doctorId, Long patientId,
                                   String doctorName, String patientName, String patientEmail,
                                   String reason, LocalDateTime normalizedTime) {
        try {
            eventPublisher.publishAppointmentEvent(
                    EventType.APPOINTMENT_BOOKED, appointment.getId(), doctorId, patientId,
                    patientName, patientEmail, doctorName, normalizedTime, reason);
        } catch (Exception e) {
            log.warn("Kafka notification failed (non-critical): {}", e.getMessage());
        }

        try {
            NotificationRequestDTO notif = new NotificationRequestDTO();
            notif.setUserId(patientId);
            notif.setAppointmentId(appointment.getId());
            notif.setMessage("Appointment booked successfully with Dr. " + doctorName);
            notificationServiceClient.createNotification(notif);
        } catch (Exception e) {
            log.warn("Feign notification failed (non-critical): {}", e.getMessage());
        }
    }
}
