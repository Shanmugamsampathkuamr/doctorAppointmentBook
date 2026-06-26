package com.sam.doctorapp.doctor.mapper;

import com.sam.doctorapp.doctor.dto.DoctorAvailabilityRequestDTO;
import com.sam.doctorapp.doctor.dto.DoctorAvailabilityResponseDTO;
import com.sam.doctorapp.doctor.model.Doctor;
import com.sam.doctorapp.doctor.model.DoctorAvailability;

public class DoctorAvailabilityMapper {
    public static DoctorAvailability toEntity(DoctorAvailabilityRequestDTO dto, Doctor doctor) {
        DoctorAvailability availability = new DoctorAvailability();
        availability.setDoctor(doctor);
        availability.setAvailableDate(dto.getAvailableDate());
        availability.setStartTime(dto.getStartTime());
        availability.setEndTime(dto.getEndTime());
        availability.setIsBooked(false);
        return availability;
    }

    public static DoctorAvailabilityResponseDTO toDTO(DoctorAvailability availability) {
        DoctorAvailabilityResponseDTO dto = new DoctorAvailabilityResponseDTO();
        dto.setId(availability.getId());
        if (availability.getDoctor() != null) {
            dto.setDoctorId(availability.getDoctor().getId());
            dto.setDoctorName(availability.getDoctor().getName());
        }
        dto.setAvailableDate(availability.getAvailableDate());
        dto.setStartTime(availability.getStartTime());
        dto.setEndTime(availability.getEndTime());
        dto.setIsBooked(availability.getIsBooked());
        return dto;
    }
}
