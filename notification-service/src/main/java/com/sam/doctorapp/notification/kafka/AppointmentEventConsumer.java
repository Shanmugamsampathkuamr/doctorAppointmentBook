package com.sam.doctorapp.notification.kafka;

import com.sam.doctorapp.common.event.AppointmentEvent;
import com.sam.doctorapp.common.event.EventType;
import com.sam.doctorapp.notification.model.Notification;
import com.sam.doctorapp.notification.repository.NotificationRepository;
import com.sam.doctorapp.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AppointmentEventConsumer {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final String fromAddress = "sampathkumar14012005@gmail.com";

    @KafkaListener(topics = "appointment-events", containerFactory = "appointmentEventKafkaListenerContainerFactory")
    public void consumeAppointmentEvent(AppointmentEvent event) {
        log.info("Received appointment event: {} for appointment {}", event.getEventType(), event.getAppointmentId());

        try {
            String subject;
            String messageText;

            if (event.getEventType() == EventType.APPOINTMENT_BOOKED) {
                subject = "Appointment Booked - HealthConnect";
                messageText = String.format(
                        "Hello %s,\n\nYour appointment with %s has been booked successfully.\nDate: %s\nReason: %s\n\nThank you for choosing HealthConnect.",
                        event.getPatientName(), event.getDoctorName(), event.getAppointmentDate(), event.getReason()
                );
            } else if (event.getEventType() == EventType.APPOINTMENT_CANCELLED) {
                subject = "Appointment Cancelled - HealthConnect";
                messageText = String.format(
                        "Hello,\n\nYour appointment scheduled for %s has been cancelled.\n\nIf this was a mistake, please book a new appointment.\n\nThank you.",
                        event.getAppointmentDate()
                );
            } else if (event.getEventType() == EventType.APPOINTMENT_COMPLETED) {
                subject = "Appointment Completed - HealthConnect";
                messageText = String.format(
                        "Hello,\n\nYour appointment with %s has been marked as completed.\n\nPlease leave a review for your visit.\n\nThank you for choosing HealthConnect.",
                        event.getDoctorName()
                );
            } else {
                log.warn("Unknown event type: {}", event.getEventType());
                return;
            }

            if (event.getPatientEmail() != null && !event.getPatientEmail().isEmpty()) {
                try {
                    emailService.sendSimpleMessage(fromAddress, event.getPatientEmail(), subject, messageText);
                    log.info("Email sent to {} for event {}", event.getPatientEmail(), event.getEventType());
                } catch (Exception e) {
                    log.error("Failed to send email to {}: {}", event.getPatientEmail(), e.getMessage());
                }
            }

            if (event.getPatientId() != null) {
                Notification notification = new Notification();
                notification.setUserId(event.getPatientId());
                notification.setAppointmentId(event.getAppointmentId());
                notification.setMessage(subject + ": " + messageText.substring(0, Math.min(150, messageText.length())));
                notificationRepository.save(notification);
                log.info("In-app notification created for user {}", event.getPatientId());
            }
        } catch (Exception e) {
            log.error("Error processing appointment event: {}", e.getMessage(), e);
        }
    }
}
