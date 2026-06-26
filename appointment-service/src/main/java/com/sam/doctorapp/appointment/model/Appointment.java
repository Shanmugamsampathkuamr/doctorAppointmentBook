package com.sam.doctorapp.appointment.model;

import com.sam.doctorapp.common.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments", uniqueConstraints = {
        @UniqueConstraint(name = "uk_doctor_slot", columnNames = {"doctor_id", "appointment_date"})
}, indexes = {
        @Index(name = "idx_doctor", columnList = "doctor_id"),
        @Index(name = "idx_patient", columnList = "patient_id"),
        @Index(name = "idx_date", columnList = "appointment_date")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AppointmentStatus status;
    @Column(columnDefinition = "TEXT")
    private String prescription;
    @Column(columnDefinition = "TEXT")
    private String reason;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (status == null) status = AppointmentStatus.BOOKED;
    }
}
