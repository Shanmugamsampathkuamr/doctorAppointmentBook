package com.sam.doctorapp.service.review;

import com.sam.doctorapp.dto.review.ReviewRequestDTO;
import com.sam.doctorapp.dto.review.ReviewResponseDTO;
import com.sam.doctorapp.exception.ResourceNotFoundException;
import com.sam.doctorapp.mapper.ReviewMapper;
import com.sam.doctorapp.model.Doctor;
import com.sam.doctorapp.model.Review;
import com.sam.doctorapp.model.User;
import com.sam.doctorapp.repository.DoctorRepository;
import com.sam.doctorapp.repository.ReviewRepository;
import com.sam.doctorapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private  static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);

    private final ReviewRepository reviewRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;


    // creating reviews//
    @Override
    public ReviewResponseDTO addReview(ReviewRequestDTO dto) {

        logger.info("Add a review by rating :{},and comment:{}",dto.getRating(),dto.getComment());
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> {

                            logger.error("Doctor not found by id :{}", dto.getDoctorId());

                           return new ResourceNotFoundException("Doctor not found:");

                        });

        User patient = userRepository.findById(dto.getPatientId())
                .orElseThrow(() ->{

                    logger.error("Patient not found by id :{}",dto.getPatientId());
                return new ResourceNotFoundException("Patient not found");
                        });

        Review review = new Review();

        review.setDoctor(doctor);
        review.setPatient(patient);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        review = reviewRepository.save(review);

        logger.info("Review added successfully by doctor id :{}",dto.getDoctorId());

        return ReviewMapper.toDTO(review);
    }


    //' get review by docter id //

    @Override
    public List<ReviewResponseDTO> getReviewsByDoctor(Long doctorId) {

        logger.info("Get review by doctor id:{}",doctorId);

        List<ReviewResponseDTO> review = reviewRepository.findByDoctorId(doctorId)
                .stream()
                .map(ReviewMapper::toDTO)
                .toList();

        logger.info("got the review by doctor id :{}",doctorId);
        return review;
    }

    @Override
    public List<ReviewResponseDTO> getAllReview() {

        logger.info("got all reviews");
        return reviewRepository.findAll()
                .stream()
                .map(ReviewMapper::toDTO)
                .toList();
    }

    // deleting review by id //

    @Override
    public void deleteReview(Long id) {

        logger.info("deleting review by id :{}",id);

        Optional<Review> review = reviewRepository.findById(id);
        if(!reviewRepository.existsById(id)){

            logger.error("Review not found with id:{}",id);
            throw new ResourceNotFoundException("User not found:"+ id );
        }

        logger.info("deleted  revivew by id:{}",id);

        reviewRepository.deleteById(id);
    }


}