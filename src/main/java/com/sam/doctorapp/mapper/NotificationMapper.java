package com.sam.doctorapp.mapper;

import com.sam.doctorapp.dto.notification.NotificationResponseDTO;
import com.sam.doctorapp.model.Notification;

public class NotificationMapper {
    public static NotificationResponseDTO toDTO(Notification notification) {
        if (notification == null) return null;

        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        // Safe check for relationships
        if (notification.getUser() != null) {
            dto.setUserId(notification.getUser().getId());
        }
        if (notification.getAppointment() != null) {
            dto.setAppointmentId(notification.getAppointment().getId());
        }

        return dto;
    }
}