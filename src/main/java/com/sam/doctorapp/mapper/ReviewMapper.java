package com.sam.doctorapp.mapper;

import com.sam.doctorapp.dto.review.ReviewResponseDTO;
import com.sam.doctorapp.model.Review;

public class ReviewMapper {

    public static ReviewResponseDTO toDTO(Review review) {
        if (review == null) return null;

        ReviewResponseDTO dto = new ReviewResponseDTO();

        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());

        // Handle Doctor safely
        if (review.getDoctor() != null) {
            dto.setDoctorName(review.getDoctor().getName());
            dto.setDoctorId(review.getDoctor().getId()); // No error now!
        }

        // Handle Patient safely
        if (review.getPatient() != null) {
            dto.setPatientName(review.getPatient().getName());
            dto.setPatientId(review.getPatient().getId()); // Good for profile links!
        }

        return dto;
    }
}
