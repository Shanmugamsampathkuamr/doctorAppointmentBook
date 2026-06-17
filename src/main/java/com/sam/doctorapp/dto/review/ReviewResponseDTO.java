package com.sam.doctorapp.dto.review;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReviewResponseDTO {

    private Long id;

    private Integer rating;

    private String comment;

    // Add these two to fix the Mapper error
    private Long doctorId;

    private Long patientId;

    private String doctorName;

    private String patientName;

    private LocalDateTime createdAt;
}
