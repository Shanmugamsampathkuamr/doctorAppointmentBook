package com.sam.doctorapp.repository;

import com.sam.doctorapp.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Fetches all messages for an appointment so they appear in order
    List<ChatMessage> findByAppointmentIdOrderByTimestampAsc(Long appointmentId);
}