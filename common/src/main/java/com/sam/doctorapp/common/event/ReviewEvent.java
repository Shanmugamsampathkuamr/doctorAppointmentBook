package com.sam.doctorapp.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewEvent {
    private EventType eventType;
    private Long reviewId;
    private Long doctorId;
    private Long patientId;
    private Integer rating;
    private String comment;
    private LocalDateTime timestamp;
}
