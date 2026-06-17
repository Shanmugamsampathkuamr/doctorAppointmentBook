package com.sam.doctorapp.service.notification;

import com.sam.doctorapp.dto.notification.NotificationRequestDTO;
import com.sam.doctorapp.dto.notification.NotificationResponseDTO;
import com.sam.doctorapp.exception.ResourceNotFoundException;
import com.sam.doctorapp.mapper.NotificationMapper;
import com.sam.doctorapp.model.Appointment;
import com.sam.doctorapp.model.Notification;
import com.sam.doctorapp.model.User;
import com.sam.doctorapp.repository.AppointmentRepository;
import com.sam.doctorapp.repository.NotificationRepository;
import com.sam.doctorapp.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;


    // get user notification //

    @Override
    public List<NotificationResponseDTO> getUserNotifications(Long userId) {

        logger.info("Get user notification by user id:{}",userId);

        List<NotificationResponseDTO> notification= notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationMapper::toDTO)
                .toList();

        logger.info("geted user notification by user id:{}",userId);

        return notification;
    }


    // creat notification //

    @Override
    public void createNotification(NotificationRequestDTO dto) {


        logger.info("creating a notification user:{}, message :{}",dto.getUserId(),dto.getMessage());
        User user = userRepository.findById((dto.getUserId()))
                .orElseThrow(()->{

                    logger.error("User not found by id:{}",dto.getUserId());
                    return new ResourceNotFoundException("User not found");
                });
        Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(()->{

                    logger.error("Appointment not found By id :{}",dto.getAppointmentId());
                    return new ResourceNotFoundException("Appointment not found");
                });
        Notification notification = new Notification();

        notification.setUser(user);
        notification.setAppointment(appointment);
        notification.setMessage(dto.getMessage());
        notification.setIsRead(false);

        logger.info("successfully send notification by id:{}",dto.getAppointmentId());

        notificationRepository.save(notification);
    }


    // mark as read //



    @Override
    public void markAsRead(Long id) {

        logger.info("Marking as read by id:{}",id);

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Notification not found with id:{}",id);
                  return  new ResourceNotFoundException("Notification not found");
                });

        notification.setIsRead(true);

        logger.info("Marked as read by id :{}",id);

        notificationRepository.save(notification);
    }
}