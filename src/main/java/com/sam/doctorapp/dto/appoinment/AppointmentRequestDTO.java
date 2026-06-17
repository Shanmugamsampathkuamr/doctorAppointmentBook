package com.sam.doctorapp.dto.appoinment;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AppointmentRequestDTO {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    // IMPORTANT: Ensure React sends "appointmentDate" to match this
    @NotNull(message = "Appointment date is required")
    private LocalDateTime appointmentDate;

    // Sent by the Patient during the booking process
    private String reason;

    // Sent by the Doctor when marking the appointment as COMPLETED
    private String prescription;

    // Optional: If you want to change status (e.g., CANCELLED) via this DTO
    private String status;
}