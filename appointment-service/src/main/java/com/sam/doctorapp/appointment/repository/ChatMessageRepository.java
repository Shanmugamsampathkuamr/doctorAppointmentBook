package com.sam.doctorapp.appointment.repository;

import com.sam.doctorapp.appointment.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByAppointmentIdOrderByTimestampAsc(Long appointmentId);

    long countByAppointmentIdAndSenderIdNotAndIsReadFalse(Long appointmentId, Long senderId);

    @Query("SELECT c.appointmentId, COUNT(c) FROM ChatMessage c WHERE c.senderId != :userId AND c.isRead = false GROUP BY c.appointmentId")
    List<Object[]> countUnreadGroupedByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE ChatMessage c SET c.isRead = true, c.readAt = :now WHERE c.appointmentId = :appointmentId AND c.senderId != :userId AND c.isRead = false")
    int markAsRead(@Param("appointmentId") Long appointmentId, @Param("userId") Long userId, @Param("now") LocalDateTime now);
}
