package com.sam.doctorapp.appointment.service.saga;

import com.sam.doctorapp.appointment.model.SagaState;
import com.sam.doctorapp.appointment.repository.SagaStateRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static com.sam.doctorapp.appointment.service.saga.SagaConstants.*;

@Service
@RequiredArgsConstructor
public class SagaRecoveryService {

    private static final Logger log = LoggerFactory.getLogger(SagaRecoveryService.class);

    private final SagaStateRepository sagaStateRepository;
    private final BookingSagaOrchestrator bookingOrchestrator;
    private final EntityManager entityManager;

    @Scheduled(fixedRate = 300_000)
    @Transactional
    public void recoverStuckSagas() {
        log.debug("Running saga recovery...");
        LocalDateTime timeout = LocalDateTime.now().minusMinutes(SAGA_TIMEOUT_MINUTES);
        List<SagaState> stuckSagas = sagaStateRepository.findByStatusAndCreatedAtBefore(STATUS_IN_PROGRESS, timeout);

        for (SagaState saga : stuckSagas) {
            log.warn("Recovering stuck saga: sagaId={}, type={}, step={}", saga.getSagaId(), saga.getSagaType(), saga.getStep());
            try {
                if (SAGA_TYPE_BOOKING.equals(saga.getSagaType())) {
                    recoverBookingSaga(saga);
                } else if (SAGA_TYPE_CANCELLATION.equals(saga.getSagaType())) {
                    recoverCancellationSaga(saga);
                }
            } catch (Exception e) {
                log.error("Failed to recover saga: sagaId={}", saga.getSagaId(), e);
                saga.setStatus(STATUS_FAILED);
                saga.setErrorMessage("Recovery failed: " + e.getMessage());
                sagaStateRepository.save(saga);
            }
        }
    }

    private void recoverBookingSaga(SagaState saga) {
        Long appointmentId = saga.getAppointmentId();
        if (appointmentId == null) {
            saga.setStatus(STATUS_FAILED);
            saga.setErrorMessage("Missing appointment ID");
            sagaStateRepository.save(saga);
            return;
        }

        var appointmentOpt = entityManager.find(
                com.sam.doctorapp.appointment.model.Appointment.class, appointmentId);

        if (appointmentOpt != null) {
            var appointment = (com.sam.doctorapp.appointment.model.Appointment) appointmentOpt;
            var status = appointment.getStatus();

            if (status == com.sam.doctorapp.common.enums.AppointmentStatus.PENDING) {
                appointment.setStatus(com.sam.doctorapp.common.enums.AppointmentStatus.CANCELLED);
                appointment.setUpdatedAt(LocalDateTime.now());
                entityManager.merge(appointment);
                saga.setStatus(STATUS_COMPENSATED);
                saga.setErrorMessage("Recovered: pending appointment cancelled due to timeout");
                log.warn("Recovered booking saga: cancelled pending appointment {}", appointmentId);
            } else if (status == com.sam.doctorapp.common.enums.AppointmentStatus.BOOKED) {
                saga.setStatus(STATUS_COMPLETED);
                saga.setErrorMessage("Recovered: saga marked as completed (appointment already booked)");
            }
        } else {
            saga.setStatus(STATUS_FAILED);
            saga.setErrorMessage("Appointment not found during recovery");
        }
        sagaStateRepository.save(saga);
    }

    private void recoverCancellationSaga(SagaState saga) {
        Long appointmentId = saga.getAppointmentId();
        if (appointmentId == null) {
            saga.setStatus(STATUS_FAILED);
            saga.setErrorMessage("Missing appointment ID");
            sagaStateRepository.save(saga);
            return;
        }

        var appointmentOpt = entityManager.find(
                com.sam.doctorapp.appointment.model.Appointment.class, appointmentId);

        if (appointmentOpt != null) {
            var appointment = (com.sam.doctorapp.appointment.model.Appointment) appointmentOpt;
            if (appointment.getStatus() == com.sam.doctorapp.common.enums.AppointmentStatus.CANCELLING) {
                appointment.setStatus(com.sam.doctorapp.common.enums.AppointmentStatus.CANCELLED);
                appointment.setUpdatedAt(LocalDateTime.now());
                entityManager.merge(appointment);
                saga.setStatus(STATUS_COMPLETED);
                saga.setErrorMessage("Recovered: cancellation completed");
                log.warn("Recovered cancellation saga: completed cancellation {}", appointmentId);
            } else if (appointment.getStatus() == com.sam.doctorapp.common.enums.AppointmentStatus.CANCELLED) {
                saga.setStatus(STATUS_COMPLETED);
                saga.setErrorMessage("Recovered: saga marked as completed (already cancelled)");
            }
        } else {
            saga.setStatus(STATUS_FAILED);
            saga.setErrorMessage("Appointment not found during recovery");
        }
        sagaStateRepository.save(saga);
    }
}
