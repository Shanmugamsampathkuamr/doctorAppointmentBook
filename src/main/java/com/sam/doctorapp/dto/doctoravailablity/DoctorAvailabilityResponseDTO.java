package com.sam.doctorapp.dto.doctoravailablity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
public class DoctorAvailabilityResponseDTO {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private LocalDate availableDate;
    private LocalTime startTime;
    private LocalTime endTime;

    // ADD THIS: The UI needs this to show "Available" vs "Unavailable"
    private Boolean isBooked;
}