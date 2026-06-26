package com.sam.doctorapp.controler;

import com.sam.doctorapp.dto.chat.ChatRequest;
import com.sam.doctorapp.dto.chat.ChatResponse;
import com.sam.doctorapp.payload.ApiResponse;
import com.sam.doctorapp.service.chat.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    // Send a message (checks 24h limit & sends email)
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<ChatResponse>> sendMessage(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.sendMessage(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Message sent", response));
    }

    // Get message history for the chat box
    @GetMapping("/history/{appointmentId}")
    public ResponseEntity<ApiResponse<List<ChatResponse>>> getChatHistory(@PathVariable Long appointmentId) {
        List<ChatResponse> history = chatService.getChatHistory(appointmentId);
        return ResponseEntity.ok(new ApiResponse<>(true, "History loaded", history));
    }
}
