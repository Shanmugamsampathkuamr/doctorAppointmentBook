package com.sam.doctorapp.appointment.controller;

import com.sam.doctorapp.appointment.dto.ReviewRequestDTO;
import com.sam.doctorapp.appointment.dto.ReviewResponseDTO;
import com.sam.doctorapp.appointment.service.ReviewService;
import com.sam.doctorapp.common.dto.ApiResponse;
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

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponseDTO>> createReview(@Valid @RequestBody ReviewRequestDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Review created", reviewService.addReview(dto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponseDTO>>> getAllReviews() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Reviews fetched", reviewService.getAllReview()));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<ReviewResponseDTO>>> getReviewsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor reviews", reviewService.getReviewsByDoctor(doctorId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Review deleted", null));
    }
}
