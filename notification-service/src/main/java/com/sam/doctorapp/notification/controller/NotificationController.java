package com.sam.doctorapp.notification.controller;

import com.sam.doctorapp.common.dto.ApiResponse;
import com.sam.doctorapp.notification.dto.NotificationRequestDTO;
import com.sam.doctorapp.notification.dto.NotificationResponseDTO;
import com.sam.doctorapp.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponseDTO>> createNotification(@Valid @RequestBody NotificationRequestDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Notification created", notificationService.createNotification(dto)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<NotificationResponseDTO>>> getNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Notifications fetched", notificationService.getUserNotifications(userId)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Marked as read", null));
    }
}
