package com.sam.doctorapp.notification.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class NotificationRequestDTO {
    @NotNull private Long userId;
    @NotNull private Long appointmentId;
    @NotNull private String message;
}
