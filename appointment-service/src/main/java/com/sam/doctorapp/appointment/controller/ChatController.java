package com.sam.doctorapp.appointment.controller;

import com.sam.doctorapp.appointment.dto.ChatRequest;
import com.sam.doctorapp.appointment.dto.ChatResponse;
import com.sam.doctorapp.appointment.service.ChatService;
import com.sam.doctorapp.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<ChatResponse>> sendMessage(@Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Message sent", chatService.sendMessage(request)));
    }

    @GetMapping("/history/{appointmentId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ChatResponse>>> getChatHistory(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "History loaded", chatService.getChatHistory(appointmentId)));
    }

    @PutMapping("/read/{appointmentId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long appointmentId,
            @RequestParam Long userId) {
        chatService.markAsRead(appointmentId, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Messages marked as read", null));
    }

    @GetMapping("/unread/{appointmentId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @PathVariable Long appointmentId,
            @RequestParam Long userId) {
        long count = chatService.getUnreadCountForAppointment(appointmentId, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Unread count", count));
    }

    @GetMapping("/unread/all/{userId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<Long, Long>>> getAllUnreadCounts(@PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Unread counts fetched", chatService.getAllUnreadCounts(userId)));
    }
}
