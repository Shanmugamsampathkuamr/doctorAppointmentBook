package com.sam.doctorapp.appointment.service;

import com.sam.doctorapp.appointment.dto.ChatRequest;
import com.sam.doctorapp.appointment.dto.ChatResponse;

import java.util.List;
import java.util.Map;

public interface ChatService {
    ChatResponse sendMessage(ChatRequest request);
    List<ChatResponse> getChatHistory(Long appointmentId);
    void markAsRead(Long appointmentId, Long userId);
    long getUnreadCountForAppointment(Long appointmentId, Long userId);
    Map<Long, Long> getAllUnreadCounts(Long userId);
}
