package com.sam.doctorapp.appointment.repository;

import com.sam.doctorapp.appointment.model.IdempotencyKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IdempotencyKeyRepository extends JpaRepository<IdempotencyKey, String> {
}
