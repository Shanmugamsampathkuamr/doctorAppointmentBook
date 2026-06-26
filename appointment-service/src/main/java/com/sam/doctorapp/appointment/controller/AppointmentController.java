package com.sam.doctorapp.appointment.controller;

import com.sam.doctorapp.appointment.dto.AppointmentRequestDTO;
import com.sam.doctorapp.appointment.dto.AppointmentResponseDTO;
import com.sam.doctorapp.appointment.service.AppointmentService;
import com.sam.doctorapp.common.dto.ApiResponse;
import com.sam.doctorapp.common.enums.AppointmentStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> bookAppointment(@Valid @RequestBody AppointmentRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Appointment booked", appointmentService.bookAppointment(dto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AppointmentResponseDTO>>> getAllAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Appointments fetched", appointmentService.getAllAppointment(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Appointment found", appointmentService.getAppointmentById(id)));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor appointments", appointmentService.getAppointmentsByDoctor(doctorId)));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getAppointmentsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient appointments", appointmentService.getAppointmentsByPatient(patientId)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> updateStatus(
            @PathVariable Long id, @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Status updated", appointmentService.updateStatus(id, status)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Cancelled", appointmentService.cancelAppointment(id)));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> completeAppointment(
            @PathVariable Long id, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Completed", appointmentService.completeAppointment(id, request.get("prescription"))));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<AppointmentResponseDTO>>> searchAppointments(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Search results", appointmentService.searchAppointments(doctorId, patientId, status, date, page, size)));
    }
}
