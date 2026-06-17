package com.sam.doctorapp.dto.notification;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationRequestDTO {

    @NotNull(message = "User Id is required")
    private Long userId;

    @NotNull(message = "Appointmentn ID is Required")
    private Long appointmentId;

    @NotNull(message = "Message canot be empty")
    private String message;

}