package com.sam.doctorapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Entity
@Table(name = "doctors", indexes = {
        @Index(name="idx_specialization", columnList = "specialization"),
        @Index(name = "idx_experience", columnList = "experience")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private String specialization;
    private Integer experience;

    @OneToOne(fetch = FetchType.LAZY) // Recommendation: Change to OneToOne for 1:1 User-Doctor link
    @JoinColumn(name="user_id", nullable = false)
    @JsonIgnore
    private User user;

    // --- ADD THIS TO FIX THE AVAILABILITY ERROR ---
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DoctorAvailability> availabilityList;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;
}
