package com.sam.doctorapp.dto.doctoravailablity;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
public class DoctorAvailabilityRequestDTO {


    @NotNull(message = "Doctor ID is requried")
    private Long doctorId;


    @NotNull(message = "Available date required")
    private LocalDate availableDate;

    @NotNull(message = "Start time required")
    private LocalTime startTime;

    @NotNull(message = "End time required")
    private LocalTime endTime;
}