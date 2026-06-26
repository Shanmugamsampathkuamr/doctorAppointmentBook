package com.sam.doctorapp.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AppointmentResponseDTO {
    private Long id;
    private LocalDateTime appointmentDate;
    private LocalDateTime updatedAt;
    private String status;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private Long patientId;
    private String patientName;
    private String reason;
    private String prescription;
}
