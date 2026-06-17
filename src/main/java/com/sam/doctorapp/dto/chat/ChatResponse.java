package com.sam.doctorapp.dto.chat;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatResponse {
    private Long id;
    private Long appointmentId;
    private Long senderId;
    private String senderName; // So the UI can show "Dr. Smith" or "Mayur"
    private String message;
    private LocalDateTime timestamp;
    private boolean isMe; // Optional: helps the frontend align bubbles left/right
}
