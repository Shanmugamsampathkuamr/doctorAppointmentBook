package com.sam.doctorapp.mapper;


import com.sam.doctorapp.dto.doctoravailablity.DoctorAvailabilityRequestDTO;
import com.sam.doctorapp.dto.doctoravailablity.DoctorAvailabilityResponseDTO;
import com.sam.doctorapp.model.Doctor;
import com.sam.doctorapp.model.DoctorAvailability;

public class DoctorAvailabilityMapper {

    public static DoctorAvailability toEntity(
            DoctorAvailabilityRequestDTO dto,
            Doctor doctor){

        DoctorAvailability availability = new DoctorAvailability();

        availability.setDoctor(doctor);
        availability.setAvailableDate(dto.getAvailableDate());
        availability.setStartTime(dto.getStartTime());
        availability.setEndTime(dto.getEndTime());

        // Optional: Ensure new entities default to false if not set
        if (availability.getIsBooked() == null) {
            availability.setIsBooked(false);
        }

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