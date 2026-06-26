package com.sam.doctorapp.doctor.mapper;

import com.sam.doctorapp.doctor.dto.DoctorResponseDTO;
import com.sam.doctorapp.doctor.model.Doctor;

public class DoctorMapper {
    public static DoctorResponseDTO toDTO(Doctor doctor) {
        if (doctor == null) return null;
        DoctorResponseDTO dto = new DoctorResponseDTO();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setExperience(doctor.getExperience());
        dto.setUserId(doctor.getUserId());
        dto.setAverageRating(0.0);
        dto.setTotalReviews(0);
        return dto;
    }
}
