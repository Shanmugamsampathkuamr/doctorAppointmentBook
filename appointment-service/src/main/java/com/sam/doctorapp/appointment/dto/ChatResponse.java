package com.sam.doctorapp.appointment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatResponse {
    private Long id;
    private Long appointmentId;
    private Long senderId;
    private String senderName;
    private String message;
    private LocalDateTime timestamp;
    private boolean isRead;
    private LocalDateTime readAt;
}
