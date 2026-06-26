package com.sam.doctorapp.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChatRequest {
    @NotNull private Long appointmentId;
    @NotNull private Long senderId;
    private String senderName;
    @NotBlank private String message;
}
