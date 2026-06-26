package com.sam.doctorapp.mapper;

import com.sam.doctorapp.dto.docter.DoctorRequestDTO;
import com.sam.doctorapp.dto.docter.DoctorResponseDTO;
import com.sam.doctorapp.model.Doctor;
import com.sam.doctorapp.model.User;

public class DoctorMapper {

    public static Doctor toEntity(DoctorRequestDTO dto, User user) {
        if (dto == null) return null;

        Doctor doctor = new Doctor();
        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setExperience(dto.getExperience());
        doctor.setUser(user);

        return doctor;
    }

    public static DoctorResponseDTO toDTO(Doctor doctor) {
        if (doctor == null) return null;

        DoctorResponseDTO dto = new DoctorResponseDTO();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setExperience(doctor.getExperience());

        if (doctor.getUser() != null) {
            dto.setUserId(doctor.getUser().getId());
        }

        if (doctor.getReviews() != null && !doctor.getReviews().isEmpty()) {
            double avg = doctor.getReviews().stream()
                    .mapToInt(r -> r.getRating() != null ? r.getRating() : 0)
                    .average()
                    .orElse(0.0);
            dto.setAverageRating(Math.round(avg * 10.0) / 10.0);
            dto.setTotalReviews(doctor.getReviews().size());
        } else {
            dto.setAverageRating(0.0);
            dto.setTotalReviews(0);
        }

        return dto;
    }
}