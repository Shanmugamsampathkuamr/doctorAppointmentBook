package com.sam.doctorapp.doctor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "doctor_availability", indexes = {
        @Index(name = "idx_doctor_date_time", columnList = "doctor_id, available_date, start_time")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DoctorAvailability {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate availableDate;
    private LocalTime startTime;
    private LocalTime endTime;
    @Column(nullable = false)
    private Boolean isBooked = false;
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
}
