package com.sam.doctorapp.appointment.kafka;

import com.sam.doctorapp.common.event.AppointmentEvent;
import com.sam.doctorapp.common.event.EventType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
public class AppointmentEventPublisher {

    private static final String TOPIC = "appointment-events";
    private final KafkaTemplate<String, AppointmentEvent> kafkaTemplate;

    public AppointmentEventPublisher(@Qualifier("appointmentEventKafkaTemplate") KafkaTemplate<String, AppointmentEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishAppointmentEvent(EventType eventType, Long appointmentId, Long doctorId,
                                         Long patientId, String patientName, String patientEmail,
                                         String doctorName, LocalDateTime appointmentDate, String reason) {
        AppointmentEvent event = new AppointmentEvent(
                eventType, appointmentId, doctorId, patientId,
                patientName, patientEmail, doctorName, appointmentDate, reason, LocalDateTime.now()
        );
        kafkaTemplate.send(TOPIC, appointmentId.toString(), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to send appointment event: {}", ex.getMessage());
                    } else {
                        log.info("Appointment event sent: {} - offset={}", eventType, result.getRecordMetadata().offset());
                    }
                });
    }
}
