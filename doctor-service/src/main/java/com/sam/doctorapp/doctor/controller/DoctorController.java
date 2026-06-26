package com.sam.doctorapp.doctor.controller;

import com.sam.doctorapp.common.dto.ApiResponse;
import com.sam.doctorapp.doctor.dto.DoctorRequestDTO;
import com.sam.doctorapp.doctor.dto.DoctorResponseDTO;
import com.sam.doctorapp.doctor.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> createDoctor(@Valid @RequestBody DoctorRequestDTO dto) {
        DoctorResponseDTO doctor = doctorService.createDoctor(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Doctor created successfully", doctor));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllDoctors(
            @RequestParam(required = false) Boolean pageable,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (Boolean.TRUE.equals(pageable)) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Doctors fetched", doctorService.getAllDoctors(page, size)));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctors fetched", doctorService.getAllDoctors()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor found", doctorService.getDoctorById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> updateDoctor(
            @PathVariable Long id, @Valid @RequestBody DoctorRequestDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor updated", doctorService.updateDoctor(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor deleted", null));
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> findBySpecialization(@PathVariable String specialization) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctors found", doctorService.findBySpecialization(specialization)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<DoctorResponseDTO>>> searchDoctors(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) Integer experience,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Search results", doctorService.searchDoctorsDynamic(specialization, experience, page, size)));
    }

    @PutMapping("/{id}/rating")
    public ResponseEntity<ApiResponse<String>> updateRating(
            @PathVariable Long id,
            @RequestParam Double averageRating,
            @RequestParam Integer totalReviews) {
        doctorService.updateAverageRating(id, averageRating, totalReviews);
        return ResponseEntity.ok(new ApiResponse<>(true, "Rating updated", null));
    }
}
