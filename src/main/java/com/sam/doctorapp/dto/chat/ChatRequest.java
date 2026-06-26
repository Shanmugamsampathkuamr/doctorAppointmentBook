package com.sam.doctorapp.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChatRequest {
    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    @NotNull(message = "Sender ID is required")
    private Long senderId;

    @NotBlank(message = "Message cannot be empty")
    private String message;
}
