package com.sam.doctorapp.model;

import com.sam.doctorapp.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "appointments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_doctor_slot",
                        columnNames = {"doctor_id", "appointment_date"}
                )
        },
        indexes = {
                @Index(name = "idx_doctor", columnList = "doctor_id"),
                @Index(name = "idx_patient", columnList = "patient_id"),
                @Index(name = "idx_date", columnList = "appointment_date")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AppointmentStatus status;

    @ManyToOne(fetch = FetchType.LAZY) // Recommendation: Use LAZY for performance
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(columnDefinition = "TEXT")
    private String prescription;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // IMPORTANT: Add this field

    // This ensures updatedAt is set whenever you complete the appointment
    public void markAsCompleted() {
        this.status = AppointmentStatus.COMPLETED;
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.status == null) {
            this.status = AppointmentStatus.BOOKED;
        }
    }
}