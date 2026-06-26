package com.sam.doctorapp.notification.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_user", columnList = "user_id"),
        @Index(name = "idx_is_read", columnList = "is_read")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String message;
    private Boolean isRead = false;
    private LocalDateTime createdAt;
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "appointment_id")
    private Long appointmentId;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (isRead == null) isRead = false;
    }
}
