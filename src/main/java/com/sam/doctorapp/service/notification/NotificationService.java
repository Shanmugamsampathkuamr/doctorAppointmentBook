package com.sam.doctorapp.service.notification;

import com.sam.doctorapp.dto.notification.NotificationRequestDTO;
import com.sam.doctorapp.dto.notification.NotificationResponseDTO;

import java.util.List;

public interface NotificationService {

    List<NotificationResponseDTO> getUserNotifications(Long userId);
    void  createNotification(NotificationRequestDTO dto);

    void markAsRead(Long id);
}
