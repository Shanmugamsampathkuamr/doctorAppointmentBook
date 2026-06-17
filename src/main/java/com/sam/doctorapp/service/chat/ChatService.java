package com.sam.doctorapp.service.chat;

import com.sam.doctorapp.dto.chat.ChatRequest;
import com.sam.doctorapp.dto.chat.ChatResponse;

import java.util.List;

public interface ChatService {
    ChatResponse sendMessage(ChatRequest request);
    List<ChatResponse> getChatHistory(Long appointmentId);
}