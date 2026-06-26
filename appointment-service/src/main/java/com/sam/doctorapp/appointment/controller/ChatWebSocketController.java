package com.sam.doctorapp.appointment.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload Map<String, Object> payload) {
        Long appointmentId = Long.valueOf(payload.get("appointmentId").toString());
        Long userId = Long.valueOf(payload.get("userId").toString());
        boolean typing = Boolean.parseBoolean(payload.get("typing").toString());

        messagingTemplate.convertAndSend(
                "/topic/chat/" + appointmentId + "/typing",
                Map.of("userId", userId, "typing", typing)
        );
    }
}