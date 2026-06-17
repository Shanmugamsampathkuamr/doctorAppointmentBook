package com.sam.doctorapp.service.chat;

import com.sam.doctorapp.dto.chat.ChatRequest;
import com.sam.doctorapp.dto.chat.ChatResponse;
import com.sam.doctorapp.enums.AppointmentStatus;
import com.sam.doctorapp.mapper.ChatMapper;
import com.sam.doctorapp.model.Appointment;
import com.sam.doctorapp.model.ChatMessage;
import com.sam.doctorapp.repository.AppointmentRepository;
import com.sam.doctorapp.repository.ChatMessageRepository;
import com.sam.doctorapp.service.EmailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatRepository;
    private final AppointmentRepository appointmentRepository;
    private final ChatMapper chatMapper;
    private final EmailService emailService;

    @Override
    @Transactional
    public ChatResponse sendMessage(ChatRequest request) {
        // 1. Fetch Appointment to check status and time
        Appointment apt = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // 2. Validate Consultation Status
        if (apt.getStatus() != AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Chat is only available after the visit is completed.");
        }

        // 3. ENFORCE TIME LIMIT: Check if 24 hours have passed since completion
        // apt.getUpdatedAt() should represent the completion time
        LocalDateTime limit = apt.getUpdatedAt().plusHours(24);
        if (LocalDateTime.now().isAfter(limit)) {
            throw new RuntimeException("The follow-up chat window has closed (24h limit).");
        }

        // 4. Create and Save Entity
        ChatMessage entity = new ChatMessage();
        entity.setAppointmentId(request.getAppointmentId());
        entity.setSenderId(request.getSenderId());
        entity.setMessage(request.getMessage());
        entity.setTimestamp(LocalDateTime.now());

        ChatMessage savedEntity = chatRepository.save(entity);

        // 5. Send Email Alert to Doctor (if sender is the Patient)
        if (request.getSenderId().equals(apt.getPatient().getId())) {
            emailService.sendSimpleMessage(
                    apt.getDoctor().getUser().getEmail(),
                    "New Patient Doubt - Apt #" + apt.getId(),
                    "Hi Dr. " + apt.getDoctor().getName() + ", your patient " +
                            apt.getPatient().getName() + " has a follow-up question: " + request.getMessage()
            );
        }

        // 6. Map to Response
        String senderName = request.getSenderId().equals(apt.getPatient().getId())
                ? apt.getPatient().getName()
                : "Dr. " + apt.getDoctor().getName();

        return chatMapper.toResponse(savedEntity, senderName);
    }

    @Override
    public List<ChatResponse> getChatHistory(Long appointmentId) {
        Appointment apt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment record not found"));

        return chatRepository.findByAppointmentIdOrderByTimestampAsc(appointmentId)
                .stream()
                .map(msg -> {
                    String name = msg.getSenderId().equals(apt.getPatient().getId())
                            ? apt.getPatient().getName()
                            : "Dr. " + apt.getDoctor().getName();
                    return chatMapper.toResponse(msg, name);
                })
                .collect(Collectors.toList());
    }
}
