package com.sam.doctorapp.controler;

import com.sam.doctorapp.dto.review.ReviewRequestDTO;
import com.sam.doctorapp.dto.review.ReviewResponseDTO;
import com.sam.doctorapp.payload.ApiResponse;
import com.sam.doctorapp.service.review.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // creat a reviews //

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponseDTO>> creatReview(@Valid @RequestBody ReviewRequestDTO dto) {
        ReviewResponseDTO review = reviewService.addReview(dto);

        return ResponseEntity.ok(
                new ApiResponse<>(true,"Review created successfully",review)
        );
    }

    // get the all reviews //

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponseDTO>>> getallReviews(){
        List<ReviewResponseDTO> reviews = reviewService.getAllReview();
        return ResponseEntity.ok(
                new ApiResponse<>(true,"got the all reviews",reviews)
        );
    }

    // get the reviews by the doctors//

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<ReviewResponseDTO>>> getReviewsByDoctor(@PathVariable Long doctorId) {

        List<ReviewResponseDTO> reviews = reviewService.getReviewsByDoctor(doctorId);


        return ResponseEntity.ok(
                new ApiResponse<>(true,"got the all reviews by the doctors",reviews)
        );
    }

    // deleted review//

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true,"deleted the review successfully",null)
        );
    }
}
