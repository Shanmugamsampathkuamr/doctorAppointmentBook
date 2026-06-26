package com.sam.doctorapp.appointment.service;

import com.sam.doctorapp.appointment.client.DoctorServiceClient;
import com.sam.doctorapp.appointment.dto.ReviewRequestDTO;
import com.sam.doctorapp.appointment.dto.ReviewResponseDTO;
import com.sam.doctorapp.appointment.mapper.ReviewMapper;
import com.sam.doctorapp.appointment.model.Review;
import com.sam.doctorapp.appointment.repository.ReviewRepository;
import com.sam.doctorapp.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);
    private final ReviewRepository reviewRepository;
    private final DoctorServiceClient doctorServiceClient;

    @Override
    @CacheEvict(value = "reviews", allEntries = true)
    public ReviewResponseDTO addReview(ReviewRequestDTO dto) {
        logger.info("Adding review for doctor {} by patient {}", dto.getDoctorId(), dto.getPatientId());
        Review review = new Review();
        review.setDoctorId(dto.getDoctorId());
        review.setPatientId(dto.getPatientId());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        ReviewResponseDTO response = ReviewMapper.toDTO(reviewRepository.save(review));

        updateDoctorAverageRating(dto.getDoctorId());
        return response;
    }

    @Override
    @Cacheable(value = "reviews", key = "'doctor_' + #doctorId")
    public List<ReviewResponseDTO> getReviewsByDoctor(Long doctorId) {
        return reviewRepository.findByDoctorId(doctorId).stream().map(ReviewMapper::toDTO).toList();
    }

    @Override
    @CacheEvict(value = "reviews", allEntries = true)
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        Long doctorId = review.getDoctorId();
        reviewRepository.deleteById(id);
        updateDoctorAverageRating(doctorId);
    }

    @Override
    @Cacheable(value = "reviews", key = "'all'")
    public List<ReviewResponseDTO> getAllReview() {
        return reviewRepository.findAll().stream().map(ReviewMapper::toDTO).toList();
    }

    private void updateDoctorAverageRating(Long doctorId) {
        try {
            List<Review> reviews = reviewRepository.findByDoctorId(doctorId);
            if (reviews.isEmpty()) return;
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            doctorServiceClient.updateDoctorRating(doctorId, Math.round(avg * 100.0) / 100.0, reviews.size());
            logger.info("Updated average rating for doctor {}: avg={}, count={}", doctorId, avg, reviews.size());
        } catch (Exception e) {
            logger.warn("Failed to update doctor rating: {}", e.getMessage());
        }
    }
}
