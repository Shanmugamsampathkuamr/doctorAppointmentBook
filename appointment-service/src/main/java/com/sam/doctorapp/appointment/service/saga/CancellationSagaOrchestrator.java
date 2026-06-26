package com.sam.doctorapp.appointment.service.saga;

import com.sam.doctorapp.appointment.client.DoctorServiceClient;
import com.sam.doctorapp.appointment.client.NotificationServiceClient;
import com.sam.doctorapp.appointment.dto.NotificationRequestDTO;
import com.sam.doctorapp.appointment.kafka.AppointmentEventPublisher;
import com.sam.doctorapp.appointment.model.Appointment;
import com.sam.doctorapp.appointment.model.SagaState;
import com.sam.doctorapp.appointment.repository.AppointmentRepository;
import com.sam.doctorapp.appointment.repository.SagaStateRepository;
import com.sam.doctorapp.common.enums.AppointmentStatus;
import com.sam.doctorapp.common.event.EventType;
import com.sam.doctorapp.common.exception.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import static com.sam.doctorapp.appointment.service.saga.SagaConstants.*;

@Service
@RequiredArgsConstructor
public class CancellationSagaOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(CancellationSagaOrchestrator.class);

    private final AppointmentRepository appointmentRepository;
    private final SagaStateRepository sagaStateRepository;
    private final DoctorServiceClient doctorServiceClient;
    private final NotificationServiceClient notificationServiceClient;
    private final AppointmentEventPublisher eventPublisher;
    private final EntityManager entityManager;

    @Transactional
    public Appointment cancelAppointmentSaga(Long appointmentId) {
        String sagaId = UUID.randomUUID().toString();
        log.info("Cancellation saga started: sagaId={}, appointmentId={}", sagaId, appointmentId);

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Appointment is already cancelled");
        }
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed appointment");
        }

        SagaState saga = createSagaState(sagaId, appointment);
        sagaStateRepository.save(saga);

        try {
            // Step 1: Mark appointment as CANCELLING
            appointment.setStatus(AppointmentStatus.CANCELLING);
            appointment.setUpdatedAt(LocalDateTime.now());
            appointment = appointmentRepository.save(appointment);

            saga.setStep(STEP_CANCELLING);
            sagaStateRepository.save(saga);

            // Step 2: Unbook slot in doctor-service (compensatable)
            saga.setStep(STEP_SLOT_UNBOOKED);
            sagaStateRepository.save(saga);

            LocalDate date = appointment.getAppointmentDate().toLocalDate();
            LocalTime startTime = appointment.getAppointmentDate().toLocalTime();

            boolean slotUnbooked = false;
            for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                try {
                    doctorServiceClient.markSlotUnbooked(appointment.getDoctorId(), date, startTime);
                    slotUnbooked = true;
                    break;
                } catch (Exception e) {
                    log.warn("Slot unbook attempt {}/{} failed: {}", attempt, MAX_RETRIES, e.getMessage());
                    if (attempt < MAX_RETRIES) {
                        Thread.sleep(1000L * attempt);
                    }
                }
            }

            if (!slotUnbooked) {
                log.warn("All attempts to unbook slot failed, proceeding with cancellation anyway");
            }

            // Step 3: Mark appointment CANCELLED and complete saga
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointment.setUpdatedAt(LocalDateTime.now());
            appointment = appointmentRepository.save(appointment);

            saga.setStep(STEP_DONE);
            saga.setStatus(STATUS_COMPLETED);
            sagaStateRepository.save(saga);

            // Non-critical: notifications
            sendNotifications(appointment);

            log.info("Cancellation saga completed: sagaId={}, appointmentId={}", sagaId, appointmentId);
            return appointment;

        } catch (Exception e) {
            log.error("Cancellation saga failed: sagaId={}", sagaId, e);
            saga.setStatus(STATUS_FAILED);
            saga.setErrorMessage(e.getMessage());
            sagaStateRepository.save(saga);

            if (appointment.getStatus() != AppointmentStatus.CANCELLED) {
                appointment.setStatus(AppointmentStatus.CANCELLED);
                appointment.setUpdatedAt(LocalDateTime.now());
                appointment = appointmentRepository.save(appointment);
            }
            throw new RuntimeException("Cancellation failed: " + e.getMessage(), e);
        }
    }

    private SagaState createSagaState(String sagaId, Appointment appointment) {
        SagaState saga = new SagaState();
        saga.setSagaId(sagaId);
        saga.setSagaType(SAGA_TYPE_CANCELLATION);
        saga.setStep(STEP_STARTED);
        saga.setStatus(STATUS_IN_PROGRESS);
        saga.setAppointmentId(appointment.getId());
        saga.setPayload(String.format("{\"appointmentId\":%d,\"doctorId\":%d,\"patientId\":%d}",
                appointment.getId(), appointment.getDoctorId(), appointment.getPatientId()));
        return saga;
    }

    private void sendNotifications(Appointment appointment) {
        try {
            eventPublisher.publishAppointmentEvent(
                    EventType.APPOINTMENT_CANCELLED, appointment.getId(), appointment.getDoctorId(),
                    appointment.getPatientId(), "", "", "", appointment.getAppointmentDate(), appointment.getReason());
        } catch (Exception e) {
            log.warn("Kafka cancellation notification failed (non-critical): {}", e.getMessage());
        }

        try {
            NotificationRequestDTO notif = new NotificationRequestDTO();
            notif.setUserId(appointment.getPatientId());
            notif.setAppointmentId(appointment.getId());
            notif.setMessage("Your appointment has been cancelled.");
            notificationServiceClient.createNotification(notif);
        } catch (Exception e) {
            log.warn("Feign cancellation notification failed (non-critical): {}", e.getMessage());
        }
    }
}
