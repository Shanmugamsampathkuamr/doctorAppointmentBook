package com.sam.doctorapp.controler;


import com.sam.doctorapp.dto.appoinment.AppointmentRequestDTO;

import com.sam.doctorapp.dto.appoinment.AppointmentResponseDTO;
import com.sam.doctorapp.enums.AppointmentStatus;
import com.sam.doctorapp.payload.ApiResponse;
import com.sam.doctorapp.service.appoinment.AppointmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
// 1. ADD THIS: Specifically allow your React frontend
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> bookAppointment(@Valid @RequestBody AppointmentRequestDTO dto) {
        AppointmentResponseDTO appointment = appointmentService.bookAppointment(dto);
        // Use HttpStatus.CREATED (201) for new records
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(true, "Appointment booked successfully", appointment)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AppointmentResponseDTO>>> getAllAppointmentsByPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AppointmentResponseDTO> appointment = appointmentService.getAllAppointment(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Appointments fetched successfully", appointment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> getAppointmentById(@PathVariable Long id) {
        AppointmentResponseDTO appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched successfully by ID", appointment));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        List<AppointmentResponseDTO> appointment = appointmentService.getAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor appointments fetched successfully", appointment));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getAppointmentsByPatient(@PathVariable Long patientId) {
        List<AppointmentResponseDTO> appointment = appointmentService.getAppointmentsByPatient(patientId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient appointments fetched successfully", appointment));
    }

    // 2. UPDATED: Standardized Status Update (Optional but helpful for React)
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> updateStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status) {
        // You can implement this in service to handle any status change (CANCELLED, COMPLETED, etc.)
        AppointmentResponseDTO updated = appointmentService.updateStatus(id, status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Status updated to " + status, updated));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> cancelAppointment(@PathVariable Long id) {
        AppointmentResponseDTO updated = appointmentService.cancelAppointment(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Appointment cancelled successfully", updated));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> completeAppointment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) { // Taking the note from a JSON body

        String prescription = request.get("prescription");
        AppointmentResponseDTO completed = appointmentService.completeAppointment(id, prescription);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Appointment completed with medical notes", completed)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<AppointmentResponseDTO>>> searchAppointment(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) AppointmentStatus status,
            // Ensure the date format matches what React sends (YYYY-MM-DD)
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<AppointmentResponseDTO> result = appointmentService.searchAppointments(doctorId, patientId, status, date, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Search results fetched", result));
    }
}