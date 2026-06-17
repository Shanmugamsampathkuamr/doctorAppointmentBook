package com.sam.doctorapp.controler;

import com.sam.doctorapp.dto.notification.NotificationRequestDTO;
import com.sam.doctorapp.dto.notification.NotificationResponseDTO;
import com.sam.doctorapp.payload.ApiResponse;
import com.sam.doctorapp.service.notification.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins =  "http://localhost:5173")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // creat the notification //

    @PostMapping
    public ResponseEntity<ApiResponse<String>> createNotification(@Valid @RequestBody NotificationRequestDTO dto){
        notificationService.createNotification(dto);
        return ResponseEntity.ok(
                new ApiResponse<>(true,"Notification created successfully",null)
        );
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<NotificationResponseDTO>>> getNotifications(@PathVariable Long userId) {
        List<NotificationResponseDTO> list = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Notifications fetched", list));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Notification marked as read", null));
    }


}