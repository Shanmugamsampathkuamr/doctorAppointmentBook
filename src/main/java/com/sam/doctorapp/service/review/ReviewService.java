package com.sam.doctorapp.service.review;

import com.sam.doctorapp.dto.review.ReviewRequestDTO;
import com.sam.doctorapp.dto.review.ReviewResponseDTO;

import java.util.List;

public interface ReviewService {

    ReviewResponseDTO addReview(ReviewRequestDTO dto);

    List<ReviewResponseDTO> getReviewsByDoctor(Long doctorId);

    List<ReviewResponseDTO> getAllReview();

    void deleteReview(Long id);
}