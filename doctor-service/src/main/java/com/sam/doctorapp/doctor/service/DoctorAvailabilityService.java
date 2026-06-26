package com.sam.doctorapp.doctor.service;

import com.sam.doctorapp.doctor.dto.DoctorAvailabilityRequestDTO;
import com.sam.doctorapp.doctor.dto.DoctorAvailabilityResponseDTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface DoctorAvailabilityService {
    DoctorAvailabilityResponseDTO addAvailability(DoctorAvailabilityRequestDTO dto);
    List<DoctorAvailabilityResponseDTO> getDoctorAvailability(Long doctorId);
    void generateMonthlySlots(Long doctorId, LocalTime startWork, LocalTime endWork, int slotDurationMinutes);
    void markDoctorAsAbsent(Long doctorId, LocalDate date);
    void deleteAvailability(Long id);
}
