package com.sam.doctorapp.notification.service;

import com.sam.doctorapp.notification.dto.NotificationRequestDTO;
import com.sam.doctorapp.notification.dto.NotificationResponseDTO;

import java.util.List;

public interface NotificationService {
    NotificationResponseDTO createNotification(NotificationRequestDTO dto);
    List<NotificationResponseDTO> getUserNotifications(Long userId);
    void markAsRead(Long id);
}
