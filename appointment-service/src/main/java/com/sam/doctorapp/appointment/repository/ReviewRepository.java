package com.sam.doctorapp.appointment.repository;

import com.sam.doctorapp.appointment.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDoctorId(Long doctorId);
    void deleteByDoctorId(Long doctorId);
    void deleteByPatientId(Long patientId);
}
