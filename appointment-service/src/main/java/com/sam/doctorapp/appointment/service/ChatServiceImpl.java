package com.sam.doctorapp.appointment.service;

import com.sam.doctorapp.appointment.client.UserServiceClient;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatRepository;
    private final AppointmentRepository appointmentRepository;
    private final ChatMapper chatMapper;
    private final UserServiceClient userServiceClient;
    private final SimpMessagingTemplate messagingTemplate;

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

        String senderName = resolveSenderName(request.getSenderId(), request.getSenderName());

        ChatMessage entity = new ChatMessage();
        entity.setAppointmentId(request.getAppointmentId());
        entity.setSenderId(request.getSenderId());
        entity.setMessage(request.getMessage());
        entity.setTimestamp(LocalDateTime.now());
        ChatMessage saved = chatRepository.save(entity);

        ChatResponse response = chatMapper.toResponse(saved, senderName);

        messagingTemplate.convertAndSend("/topic/chat/" + request.getAppointmentId(), response);

        log.info("Chat message sent: appointmentId={}, senderId={}", request.getAppointmentId(), request.getSenderId());

        return response;
    }

    @Override
    @Transactional
    public List<ChatResponse> getChatHistory(Long appointmentId) {
        return chatRepository.findByAppointmentIdOrderByTimestampAsc(appointmentId)
                .stream()
                .map(msg -> chatMapper.toResponse(msg, resolveSenderName(msg.getSenderId(), null)))
                .toList();
    }

    @Override
    @Transactional
    public void markAsRead(Long appointmentId, Long userId) {
        int updated = chatRepository.markAsRead(appointmentId, userId, LocalDateTime.now());
        if (updated > 0) {
            messagingTemplate.convertAndSend("/topic/chat/" + appointmentId + "/read", userId);
            log.info("Chat messages marked as read: appointmentId={}, userId={}, count={}", appointmentId, userId, updated);
        }
    }

    @Override
    public long getUnreadCountForAppointment(Long appointmentId, Long userId) {
        return chatRepository.countByAppointmentIdAndSenderIdNotAndIsReadFalse(appointmentId, userId);
    }

    @Override
    public Map<Long, Long> getAllUnreadCounts(Long userId) {
        List<Object[]> results = chatRepository.countUnreadGroupedByUserId(userId);
        Map<Long, Long> counts = new HashMap<>();
        for (Object[] row : results) {
            counts.put((Long) row[0], (Long) row[1]);
        }
        return counts;
    }

    private String resolveSenderName(Long senderId, String clientHint) {
        if (clientHint != null && !clientHint.isBlank()) {
            return clientHint;
        }
        try {
            Map<String, Object> response = userServiceClient.getUserById(senderId);
            if (response != null && response.containsKey("data")) {
                Object data = response.get("data");
                if (data instanceof Map) {
                    Object name = ((Map<?, ?>) data).get("name");
                    if (name != null) return name.toString();
                }
            }
            if (response != null && response.containsKey("name")) {
                Object name = response.get("name");
                if (name != null) return name.toString();
            }
        } catch (Exception e) {
            log.warn("Failed to resolve sender name for userId={}: {}", senderId, e.getMessage());
        }
        return "User " + senderId;
    }
}