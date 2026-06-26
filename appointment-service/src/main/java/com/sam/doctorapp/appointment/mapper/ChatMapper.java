package com.sam.doctorapp.appointment.mapper;

import com.sam.doctorapp.appointment.dto.ChatResponse;
import com.sam.doctorapp.appointment.model.ChatMessage;
import org.springframework.stereotype.Component;

@Component
public class ChatMapper {
    public ChatResponse toResponse(ChatMessage entity, String senderName) {
        return ChatResponse.builder()
                .id(entity.getId())
                .appointmentId(entity.getAppointmentId())
                .senderId(entity.getSenderId())
                .senderName(senderName)
                .message(entity.getMessage())
                .timestamp(entity.getTimestamp())
                .build();
    }
}
