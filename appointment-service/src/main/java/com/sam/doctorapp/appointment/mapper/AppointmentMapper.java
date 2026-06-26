package com.sam.doctorapp.appointment.mapper;

import com.sam.doctorapp.appointment.dto.AppointmentResponseDTO;
import com.sam.doctorapp.appointment.model.Appointment;

public class AppointmentMapper {
    public static AppointmentResponseDTO toDTO(Appointment appointment) {
        if (appointment == null) return null;
        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        dto.setId(appointment.getId());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setUpdatedAt(appointment.getUpdatedAt());
        dto.setStatus(appointment.getStatus() != null ? appointment.getStatus().name() : null);
        dto.setDoctorId(appointment.getDoctorId());
        dto.setPatientId(appointment.getPatientId());
        dto.setReason(appointment.getReason());
        dto.setPrescription(appointment.getPrescription());
        return dto;
    }
}
