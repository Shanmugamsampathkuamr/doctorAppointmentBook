package com.sam.doctorapp.mapper;

import com.sam.doctorapp.dto.appoinment.AppointmentResponseDTO;
import com.sam.doctorapp.model.Appointment;

public class AppointmentMapper {

    public static AppointmentResponseDTO toDTO(Appointment appointment) {
        if (appointment == null) return null;

        AppointmentResponseDTO dto = new AppointmentResponseDTO();

        dto.setId(appointment.getId());
        dto.setAppointmentDate(appointment.getAppointmentDate());

        // --- ADD THIS LINE ---
        // This passes the completion timestamp to the DTO
        dto.setUpdatedAt(appointment.getUpdatedAt());

        // 1. Handle Status safely
        if (appointment.getStatus() != null) {
            dto.setStatus(appointment.getStatus().name());
        }

        // 2. Handle Doctor safely
        if (appointment.getDoctor() != null) {
            dto.setDoctorId(appointment.getDoctor().getId());
            dto.setDoctorName(appointment.getDoctor().getName());
            dto.setDoctorSpecialization(appointment.getDoctor().getSpecialization());
        }

        // 3. Handle Patient safely
        if (appointment.getPatient() != null) {
            dto.setPatientId(appointment.getPatient().getId());
            dto.setPatientName(appointment.getPatient().getName());
        }

        // 4. Map the text fields
        dto.setReason(appointment.getReason());
        dto.setPrescription(appointment.getPrescription());

        return dto;
    }
}