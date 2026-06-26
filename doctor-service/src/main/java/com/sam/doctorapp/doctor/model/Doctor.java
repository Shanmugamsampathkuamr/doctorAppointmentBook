package com.sam.doctorapp.doctor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "doctors", indexes = {
        @Index(name = "idx_specialization", columnList = "specialization"),
        @Index(name = "idx_experience", columnList = "experience")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Doctor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    private String specialization;
    private Integer experience;
    @Column(name = "user_id", nullable = false)
    private Long userId;
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DoctorAvailability> availabilityList;
}
