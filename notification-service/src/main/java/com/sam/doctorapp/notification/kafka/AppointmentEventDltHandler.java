package com.sam.doctorapp.notification.kafka;

import com.sam.doctorapp.common.event.AppointmentEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Component
public class AppointmentEventDltHandler {

    private static final Logger log = LoggerFactory.getLogger(AppointmentEventDltHandler.class);

    @DltHandler
    public void handleDlt(AppointmentEvent event, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                          @Header(KafkaHeaders.OFFSET) long offset,
                          @Header(KafkaHeaders.EXCEPTION_MESSAGE) String error) {
        log.error("DLT received for event {} from topic {} at offset {}. Error: {}",
                event.getEventType(), topic, offset, error);
    }
}
