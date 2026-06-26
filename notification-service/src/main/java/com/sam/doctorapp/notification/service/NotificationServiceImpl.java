package com.sam.doctorapp.notification.service;

import com.sam.doctorapp.common.exception.ResourceNotFoundException;
import com.sam.doctorapp.notification.dto.NotificationRequestDTO;
import com.sam.doctorapp.notification.dto.NotificationResponseDTO;
import com.sam.doctorapp.notification.mapper.NotificationMapper;
import com.sam.doctorapp.notification.model.Notification;
import com.sam.doctorapp.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);
    private final NotificationRepository notificationRepository;

    @Override
    public NotificationResponseDTO createNotification(NotificationRequestDTO dto) {
        logger.info("Creating notification for user {}: {}", dto.getUserId(), dto.getMessage());
        Notification notification = new Notification();
        notification.setUserId(dto.getUserId());
        notification.setAppointmentId(dto.getAppointmentId());
        notification.setMessage(dto.getMessage());
        notification.setIsRead(false);
        return NotificationMapper.toDTO(notificationRepository.save(notification));
    }

    @Override
    public List<NotificationResponseDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationMapper::toDTO).toList();
    }

    @Override
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
