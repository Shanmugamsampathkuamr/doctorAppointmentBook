package com.sam.doctorapp.appointment.service;

import com.sam.doctorapp.appointment.dto.ReviewRequestDTO;
import com.sam.doctorapp.appointment.dto.ReviewResponseDTO;

import java.util.List;

public interface ReviewService {
    ReviewResponseDTO addReview(ReviewRequestDTO dto);
    List<ReviewResponseDTO> getReviewsByDoctor(Long doctorId);
    List<ReviewResponseDTO> getAllReview();
    void deleteReview(Long id);
}
