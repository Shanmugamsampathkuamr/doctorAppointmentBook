package com.sam.doctorapp.dto.appoinment;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDTO {

    private Long id;

    private LocalDateTime appointmentDate;

    // ADD THIS LINE BELOW
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