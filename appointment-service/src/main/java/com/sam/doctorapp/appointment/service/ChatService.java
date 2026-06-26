package com.sam.doctorapp.appointment.service;

import com.sam.doctorapp.appointment.dto.ChatRequest;
import com.sam.doctorapp.appointment.dto.ChatResponse;

import java.util.List;

public interface ChatService {
    ChatResponse sendMessage(ChatRequest request);
    List<ChatResponse> getChatHistory(Long appointmentId);
}
