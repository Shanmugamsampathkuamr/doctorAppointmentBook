package com.sam.doctorapp.doctor.repository;

import com.sam.doctorapp.doctor.model.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long>, JpaSpecificationExecutor<Doctor> {
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findByExperience(int experience);
    List<Doctor> findBySpecializationAndExperience(String specialization, int experience);
    Optional<Doctor> findByUserId(Long userId);
    Page<Doctor> findAll(Pageable pageable);
}
