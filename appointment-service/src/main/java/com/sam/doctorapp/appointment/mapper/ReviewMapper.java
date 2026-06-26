package com.sam.doctorapp.appointment.mapper;

import com.sam.doctorapp.appointment.dto.ReviewResponseDTO;
import com.sam.doctorapp.appointment.model.Review;

public class ReviewMapper {
    public static ReviewResponseDTO toDTO(Review review) {
        if (review == null) return null;
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setDoctorId(review.getDoctorId());
        dto.setPatientId(review.getPatientId());
        return dto;
    }
}
