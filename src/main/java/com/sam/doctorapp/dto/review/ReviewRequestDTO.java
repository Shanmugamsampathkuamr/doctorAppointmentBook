package com.sam.doctorapp.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

@Getter
@Setter
public class ReviewRequestDTO {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;


    @NotNull(message = "Patient ID required")
    private Long patientId;


    @Min(value = 1,message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;


    @NotBlank(message = "Comment cannot be empty")
    private String comment;
}
