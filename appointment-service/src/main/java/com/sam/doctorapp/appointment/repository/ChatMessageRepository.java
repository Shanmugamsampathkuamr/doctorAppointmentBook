package com.sam.doctorapp.appointment.repository;

import com.sam.doctorapp.appointment.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByAppointmentIdOrderByTimestampAsc(Long appointmentId);
}
