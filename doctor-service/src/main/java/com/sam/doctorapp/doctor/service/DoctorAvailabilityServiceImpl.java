package com.sam.doctorapp.doctor.service;

import com.sam.doctorapp.common.exception.ResourceNotFoundException;
import com.sam.doctorapp.doctor.dto.DoctorAvailabilityRequestDTO;
import com.sam.doctorapp.doctor.dto.DoctorAvailabilityResponseDTO;
import com.sam.doctorapp.doctor.mapper.DoctorAvailabilityMapper;
import com.sam.doctorapp.doctor.model.Doctor;
import com.sam.doctorapp.doctor.model.DoctorAvailability;
import com.sam.doctorapp.doctor.repository.DoctorAvailabilityRepository;
import com.sam.doctorapp.doctor.repository.DoctorRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorAvailabilityServiceImpl.class);
    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorRepository doctorRepository;

    @Override
    @Transactional
    public DoctorAvailabilityResponseDTO addAvailability(DoctorAvailabilityRequestDTO dto) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        DoctorAvailability availability = DoctorAvailabilityMapper.toEntity(dto, doctor);
        return DoctorAvailabilityMapper.toDTO(availabilityRepository.save(availability));
    }

    @Override
    @Transactional
    public void generateMonthlySlots(Long doctorId, LocalTime startWork, LocalTime endWork, int slotDurationMinutes) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        LocalDate today = LocalDate.now();
        int slotsCreated = 0, slotsSkipped = 0;

        for (int i = 0; i < 30; i++) {
            LocalDate targetDate = today.plusDays(i);
            if (targetDate.getDayOfWeek() == DayOfWeek.SATURDAY || targetDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
                continue;
            }

            LocalTime currentTime = startWork;
            while (currentTime.plusMinutes(slotDurationMinutes).isBefore(endWork.plusSeconds(1))) {
                Optional<DoctorAvailability> existing = availabilityRepository
                        .findByDoctorIdAndAvailableDateAndStartTime(doctorId, targetDate, currentTime);
                if (existing.isEmpty()) {
                    DoctorAvailability slot = new DoctorAvailability();
                    slot.setDoctor(doctor);
                    slot.setAvailableDate(targetDate);
                    slot.setStartTime(currentTime);
                    slot.setEndTime(currentTime.plusMinutes(slotDurationMinutes));
                    slot.setIsBooked(false);
                    availabilityRepository.save(slot);
                    slotsCreated++;
                } else {
                    slotsSkipped++;
                }
                currentTime = currentTime.plusMinutes(slotDurationMinutes);
            }
        }
        logger.info("Generated {} slots, skipped {} duplicates for Dr. {}", slotsCreated, slotsSkipped, doctor.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorAvailabilityResponseDTO> getDoctorAvailability(Long doctorId) {
        return availabilityRepository.findByDoctorId(doctorId).stream()
                .map(DoctorAvailabilityMapper::toDTO).toList();
    }

    @Override
    @Transactional
    public void markDoctorAsAbsent(Long doctorId, LocalDate date) {
        List<DoctorAvailability> slots = availabilityRepository.findByDoctorIdAndAvailableDate(doctorId, date);
        for (DoctorAvailability slot : slots) {
            if (!slot.getIsBooked()) {
                availabilityRepository.delete(slot);
            } else {
                logger.warn("Slot at {} is already booked. Cancel appointment manually.", slot.getStartTime());
            }
        }
    }

    @Override
    @Transactional
    public void deleteAvailability(Long id) {
        DoctorAvailability slot = availabilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found"));
        if (slot.getIsBooked()) {
            throw new RuntimeException("Cannot delete a booked slot");
        }
        availabilityRepository.delete(slot);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkSlotAvailability(Long doctorId, LocalDate date, LocalTime startTime) {
        return availabilityRepository
                .findByDoctorIdAndAvailableDateAndStartTime(doctorId, date, startTime)
                .filter(slot -> !slot.getIsBooked())
                .isPresent();
    }

    @Override
    @Transactional
    public boolean markSlotBooked(Long doctorId, LocalDate date, LocalTime startTime) {
        Optional<DoctorAvailability> slot = availabilityRepository
                .findByDoctorIdAndAvailableDateAndStartTime(doctorId, date, startTime);
        if (slot.isEmpty() || slot.get().getIsBooked()) {
            return false;
        }
        slot.get().setIsBooked(true);
        availabilityRepository.save(slot.get());
        return true;
    }

    @Override
    @Transactional
    public void markSlotUnbooked(Long doctorId, LocalDate date, LocalTime startTime) {
        availabilityRepository.findByDoctorIdAndAvailableDateAndStartTime(doctorId, date, startTime)
                .ifPresent(slot -> {
                    slot.setIsBooked(false);
                    availabilityRepository.save(slot);
                });
    }
}
