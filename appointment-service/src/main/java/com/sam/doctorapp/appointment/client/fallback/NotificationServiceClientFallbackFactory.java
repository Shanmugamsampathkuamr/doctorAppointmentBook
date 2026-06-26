package com.sam.doctorapp.appointment.client.fallback;

import com.sam.doctorapp.appointment.client.NotificationServiceClient;
import com.sam.doctorapp.appointment.dto.NotificationRequestDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class NotificationServiceClientFallbackFactory implements FallbackFactory<NotificationServiceClient> {

    @Override
    public NotificationServiceClient create(Throwable cause) {
        log.error("Fallback triggered for NotificationServiceClient: {}", cause.getMessage());
        return new NotificationServiceClient() {
            @Override
            public void createNotification(NotificationRequestDTO dto) {
                log.warn("Fallback: createNotification for user {} - {}", dto.getUserId(), dto.getMessage());
            }
        };
    }
}
