package com.sam.doctorapp.appointment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    @Column(name = "doctor_id")
    private Long doctorId;
    @Column(name = "patient_id")
    private Long patientId;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
