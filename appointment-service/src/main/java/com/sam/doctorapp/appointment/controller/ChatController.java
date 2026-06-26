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
}
