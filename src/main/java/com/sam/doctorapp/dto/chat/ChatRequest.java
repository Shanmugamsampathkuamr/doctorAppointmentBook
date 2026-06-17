package com.sam.doctorapp.dto.chat;

import lombok.Data;

@Data
public class ChatRequest {
    private Long appointmentId;
    private Long senderId;
    private String message;
}
