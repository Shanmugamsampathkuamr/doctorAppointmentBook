package com.sam.doctorapp.appointment.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages", indexes = {
    @Index(name = "idx_chat_appointment", columnList = "appointmentId"),
    @Index(name = "idx_chat_unread", columnList = "appointmentId, senderId, isRead")
})
@Data
public class ChatMessage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long appointmentId;
    private Long senderId;

    @Column(columnDefinition = "TEXT")
    private String message;
    private LocalDateTime timestamp;

    private boolean isRead;
    private LocalDateTime readAt;

    @PrePersist
    public void prePersist() {
        if (timestamp == null) timestamp = LocalDateTime.now();
        isRead = false;
    }
}
