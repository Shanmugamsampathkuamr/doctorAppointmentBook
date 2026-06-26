package com.sam.doctorapp.appointment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class AppointmentRequestDTO {
    @NotNull private Long doctorId;
    @NotNull private Long patientId;
    @NotNull private LocalDateTime appointmentDate;
    private String reason;
    private String prescription;
    private String status;
}
