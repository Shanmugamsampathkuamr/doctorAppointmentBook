package com.sam.doctorapp.repository;

import com.sam.doctorapp.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review,Long> {


    List<Review> findByDoctorId(Long doctorId);

    @Modifying
    @Transactional
    void deleteByDoctorId(Long doctorId);

    @Modifying
    @Transactional
    void deleteByPatientId(Long patientId);

}
