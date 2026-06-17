package com.sam.doctorapp.service.doctorAvailability;

import com.sam.doctorapp.dto.doctoravailablity.DoctorAvailabilityRequestDTO;
import com.sam.doctorapp.dto.doctoravailablity.DoctorAvailabilityResponseDTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface DoctorAvailabilityService {

    DoctorAvailabilityResponseDTO addAvailability(DoctorAvailabilityRequestDTO dto);

    List<DoctorAvailabilityResponseDTO> getDoctorAvailability(Long doctorId);

    void deleteAvailability(Long id);
    void generateMonthlySlots(Long doctorId, LocalTime startWork, LocalTime endWork, int slotDurationMinutes);
    void markDoctorAsAbsent(Long doctorId , LocalDate date);
}