package com.sam.doctorapp.notification.mapper;

import com.sam.doctorapp.notification.dto.NotificationResponseDTO;
import com.sam.doctorapp.notification.model.Notification;

public class NotificationMapper {
    public static NotificationResponseDTO toDTO(Notification notification) {
        if (notification == null) return null;
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setUserId(notification.getUserId());
        dto.setAppointmentId(notification.getAppointmentId());
        return dto;
    }
}
