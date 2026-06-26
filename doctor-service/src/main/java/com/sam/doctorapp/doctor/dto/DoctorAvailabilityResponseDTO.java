package com.sam.doctorapp.doctor.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter
public class DoctorAvailabilityResponseDTO {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private LocalDate availableDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isBooked;
}
