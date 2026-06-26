package com.sam.doctorapp.appointment.repository;

import com.sam.doctorapp.appointment.model.SagaState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SagaStateRepository extends JpaRepository<SagaState, Long> {
    Optional<SagaState> findBySagaId(String sagaId);
    List<SagaState> findByStatus(String status);
    List<SagaState> findByStatusAndCreatedAtBefore(String status, LocalDateTime before);
    List<SagaState> findByAppointmentId(Long appointmentId);
}
