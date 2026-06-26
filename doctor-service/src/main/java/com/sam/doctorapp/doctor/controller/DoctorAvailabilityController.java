package com.sam.doctorapp.doctor.controller;

import com.sam.doctorapp.common.dto.ApiResponse;
import com.sam.doctorapp.doctor.dto.DoctorAvailabilityRequestDTO;
import com.sam.doctorapp.doctor.dto.DoctorAvailabilityResponseDTO;
import com.sam.doctorapp.doctor.service.DoctorAvailabilityService;
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

    @PostMapping("/add/{doctorId}")
    public ResponseEntity<ApiResponse<DoctorAvailabilityResponseDTO>> addAvailability(
            @PathVariable Long doctorId, @Valid @RequestBody DoctorAvailabilityRequestDTO dto) {
        dto.setDoctorId(doctorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Slot added", availabilityService.addAvailability(dto)));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<DoctorAvailabilityResponseDTO>>> getDoctorAvailability(@PathVariable Long doctorId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Slots fetched", availabilityService.getDoctorAvailability(doctorId)));
    }

    @DeleteMapping("/doctor/{doctorId}/absent")
    public ResponseEntity<ApiResponse<String>> markAsAbsent(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        availabilityService.markDoctorAsAbsent(doctorId, date);
        return ResponseEntity.ok(new ApiResponse<>(true, "Marked as absent for " + date, null));
    }

    @PostMapping("/doctor/{doctorId}/generate")
    public ResponseEntity<ApiResponse<String>> generateSlots(
            @PathVariable Long doctorId,
            @RequestParam String start, @RequestParam String end, @RequestParam int duration) {
        availabilityService.generateMonthlySlots(doctorId, LocalTime.parse(start), LocalTime.parse(end), duration);
        return ResponseEntity.ok(new ApiResponse<>(true, "Slots generated successfully", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Slot deleted", null));
    }

    @GetMapping("/doctor/{doctorId}/check")
    public ResponseEntity<ApiResponse<Boolean>> checkSlotAvailability(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime) {
        boolean available = availabilityService.checkSlotAvailability(doctorId, date, startTime);
        return ResponseEntity.ok(new ApiResponse<>(true, available ? "Slot available" : "Slot not available", available));
    }

    @PutMapping("/doctor/{doctorId}/book")
    public ResponseEntity<ApiResponse<Boolean>> markSlotBooked(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime) {
        boolean success = availabilityService.markSlotBooked(doctorId, date, startTime);
        return ResponseEntity.ok(new ApiResponse<>(true, success ? "Slot booked" : "Slot not available", success));
    }

    @PutMapping("/doctor/{doctorId}/unbook")
    public ResponseEntity<ApiResponse<String>> markSlotUnbooked(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime) {
        availabilityService.markSlotUnbooked(doctorId, date, startTime);
        return ResponseEntity.ok(new ApiResponse<>(true, "Slot unbooked", null));
    }
}
