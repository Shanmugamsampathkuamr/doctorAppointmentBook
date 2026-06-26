package com.sam.doctorapp.notification.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class NotificationResponseDTO {
    private Long id;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private Long userId;
    private Long appointmentId;
}
