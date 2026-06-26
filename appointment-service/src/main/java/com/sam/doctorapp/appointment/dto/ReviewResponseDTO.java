package com.sam.doctorapp.appointment.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class ReviewResponseDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private Long doctorId;
    private Long patientId;
    private String doctorName;
    private String patientName;
    private LocalDateTime createdAt;
}
