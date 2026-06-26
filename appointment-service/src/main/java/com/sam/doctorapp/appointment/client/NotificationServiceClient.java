package com.sam.doctorapp.appointment.client;

import com.sam.doctorapp.appointment.dto.NotificationRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service")
public interface NotificationServiceClient {
    @PostMapping("/api/notifications")
    void createNotification(@RequestBody NotificationRequestDTO dto);
}
