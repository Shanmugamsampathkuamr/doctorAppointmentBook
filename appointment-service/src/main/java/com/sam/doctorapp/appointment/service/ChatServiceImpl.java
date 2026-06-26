package com.sam.doctorapp.appointment.service;

import com.sam.doctorapp.appointment.dto.ChatRequest;
import com.sam.doctorapp.appointment.dto.ChatResponse;
import com.sam.doctorapp.appointment.mapper.ChatMapper;
import com.sam.doctorapp.appointment.model.Appointment;
import com.sam.doctorapp.appointment.model.ChatMessage;
import com.sam.doctorapp.appointment.repository.AppointmentRepository;
import com.sam.doctorapp.appointment.repository.ChatMessageRepository;
import com.sam.doctorapp.common.enums.AppointmentStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatRepository;
    private final AppointmentRepository appointmentRepository;
    private final ChatMapper chatMapper;

    @Override
    @Transactional
    public ChatResponse sendMessage(ChatRequest request) {
        Appointment apt = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (apt.getStatus() != AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Chat is only available after the visit is completed.");
        }

        LocalDateTime limit = apt.getUpdatedAt().plusHours(24);
        if (LocalDateTime.now().isAfter(limit)) {
            throw new RuntimeException("The follow-up chat window has closed (24h limit).");
        }

        ChatMessage entity = new ChatMessage();
        entity.setAppointmentId(request.getAppointmentId());
        entity.setSenderId(request.getSenderId());
        entity.setMessage(request.getMessage());
        entity.setTimestamp(LocalDateTime.now());
        ChatMessage saved = chatRepository.save(entity);

        String senderName = "User " + request.getSenderId();
        return chatMapper.toResponse(saved, senderName);
    }

    @Override
    public List<ChatResponse> getChatHistory(Long appointmentId) {
        return chatRepository.findByAppointmentIdOrderByTimestampAsc(appointmentId)
                .stream()
                .map(msg -> chatMapper.toResponse(msg, "User " + msg.getSenderId()))
                .toList();
    }
}
