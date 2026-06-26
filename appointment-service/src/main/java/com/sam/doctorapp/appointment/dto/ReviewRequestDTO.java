package com.sam.doctorapp.appointment.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReviewRequestDTO {
    @NotNull private Long doctorId;
    @NotNull private Long patientId;
    @Min(1) @Max(5) private Integer rating;
    @NotBlank private String comment;
}
