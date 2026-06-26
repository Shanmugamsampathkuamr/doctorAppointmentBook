package com.sam.doctorapp.appointment.client;

import com.sam.doctorapp.appointment.client.fallback.DoctorServiceClientFallbackFactory;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@FeignClient(name = "doctor-service", fallbackFactory = DoctorServiceClientFallbackFactory.class)
public interface DoctorServiceClient {
    @GetMapping("/api/doctors/{id}")
    Map<String, Object> getDoctorById(@PathVariable("id") Long id);

    @GetMapping("/api/availability/doctor/{doctorId}/check")
    Map<String, Object> checkSlotAvailability(
            @PathVariable("doctorId") Long doctorId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("startTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime);

    @PutMapping("/api/availability/doctor/{doctorId}/book")
    Map<String, Object> markSlotBooked(
            @PathVariable("doctorId") Long doctorId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("startTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime);

    @PutMapping("/api/availability/doctor/{doctorId}/unbook")
    Map<String, Object> markSlotUnbooked(
            @PathVariable("doctorId") Long doctorId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("startTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime);

    @PutMapping("/api/doctors/{id}/rating")
    Map<String, Object> updateDoctorRating(
            @PathVariable("id") Long id,
            @RequestParam("averageRating") Double averageRating,
            @RequestParam("totalReviews") Integer totalReviews);
}
