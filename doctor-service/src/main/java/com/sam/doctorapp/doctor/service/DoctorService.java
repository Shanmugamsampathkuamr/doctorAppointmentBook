package com.sam.doctorapp.doctor.service;

import com.sam.doctorapp.doctor.dto.DoctorRequestDTO;
import com.sam.doctorapp.doctor.dto.DoctorResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface DoctorService {
    DoctorResponseDTO createDoctor(DoctorRequestDTO dto);
    List<DoctorResponseDTO> getAllDoctors();
    DoctorResponseDTO getDoctorById(Long id);
    DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO dto);
    void deleteDoctor(Long id);
    List<DoctorResponseDTO> findBySpecialization(String specialization);
    Page<DoctorResponseDTO> searchDoctorsDynamic(String specialization, Integer experience, int page, int size);
    Page<DoctorResponseDTO> getAllDoctors(int page, int size);
    List<DoctorResponseDTO> searchDoctors(String specialization, Integer experience);
    void updateAverageRating(Long doctorId, Double averageRating, Integer totalReviews);
}
