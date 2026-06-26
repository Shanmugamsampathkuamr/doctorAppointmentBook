package com.sam.doctorapp.appointment.service;

import com.sam.doctorapp.appointment.dto.ReviewRequestDTO;
import com.sam.doctorapp.appointment.dto.ReviewResponseDTO;
import com.sam.doctorapp.appointment.mapper.ReviewMapper;
import com.sam.doctorapp.appointment.model.Review;
import com.sam.doctorapp.appointment.repository.ReviewRepository;
import com.sam.doctorapp.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);
    private final ReviewRepository reviewRepository;

    @Override
    public ReviewResponseDTO addReview(ReviewRequestDTO dto) {
        logger.info("Adding review for doctor {} by patient {}", dto.getDoctorId(), dto.getPatientId());
        Review review = new Review();
        review.setDoctorId(dto.getDoctorId());
        review.setPatientId(dto.getPatientId());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        return ReviewMapper.toDTO(reviewRepository.save(review));
    }

    @Override
    public List<ReviewResponseDTO> getReviewsByDoctor(Long doctorId) {
        return reviewRepository.findByDoctorId(doctorId).stream().map(ReviewMapper::toDTO).toList();
    }

    @Override
    public List<ReviewResponseDTO> getAllReview() {
        return reviewRepository.findAll().stream().map(ReviewMapper::toDTO).toList();
    }

    @Override
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review not found");
        }
        reviewRepository.deleteById(id);
    }
}
