package com.sam.doctorapp.controler;

import com.sam.doctorapp.dto.doctoravailablity.DoctorAvailabilityRequestDTO;
import com.sam.doctorapp.dto.doctoravailablity.DoctorAvailabilityResponseDTO;
import com.sam.doctorapp.payload.ApiResponse;
import com.sam.doctorapp.service.doctorAvailability.DoctorAvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;

    // 1. Unified Add Slot (matches React AvailabilityModal.jsx)
    @PostMapping("/add/{doctorId}")
    public ResponseEntity<ApiResponse<DoctorAvailabilityResponseDTO>> addAvailability(
            @PathVariable Long doctorId,
            @Valid @RequestBody DoctorAvailabilityRequestDTO dto) {
        dto.setDoctorId(doctorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Slot added successfully", availabilityService.addAvailability(dto)));
    }

    // 2. Standardized Get Slots (matches React PatientHome.jsx)
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<DoctorAvailabilityResponseDTO>>> getDoctorAvailability(@PathVariable Long doctorId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Slots fetched", availabilityService.getDoctorAvailability(doctorId)));
    }

    // 3. THE "ABSENT" FEATURE: Admin can clear a doctor's schedule for a specific date
    @DeleteMapping("/doctor/{doctorId}/absent")
    public ResponseEntity<ApiResponse<String>> markAsAbsent(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        availabilityService.markDoctorAsAbsent(doctorId, date);
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor marked as absent for " + date, null));
    }

    // 4. Monthly Generation
    @PostMapping("/doctor/{doctorId}/generate")
    public ResponseEntity<ApiResponse<String>> generateSlots(
            @PathVariable Long doctorId,
            @RequestParam String start,
            @RequestParam String end,
            @RequestParam int duration) {

        availabilityService.generateMonthlySlots(
                doctorId,
                LocalTime.parse(start),
                LocalTime.parse(end),
                duration
        );

        return ResponseEntity.ok(new ApiResponse<>(true, "30 days of slots generated successfully", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Slot deleted successfully", null));
    }
}