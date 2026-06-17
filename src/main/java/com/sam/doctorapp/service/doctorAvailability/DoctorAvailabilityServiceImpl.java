package com.sam.doctorapp.service.doctorAvailability;

import com.sam.doctorapp.dto.doctoravailablity.DoctorAvailabilityRequestDTO;
import com.sam.doctorapp.dto.doctoravailablity.DoctorAvailabilityResponseDTO;
import com.sam.doctorapp.exception.ResourceNotFoundException;
import com.sam.doctorapp.mapper.DoctorAvailabilityMapper;
import com.sam.doctorapp.model.Doctor;
import com.sam.doctorapp.model.DoctorAvailability;
import com.sam.doctorapp.repository.DoctorAviailabilityRepository;
import com.sam.doctorapp.repository.DoctorRepository;
import jakarta.transaction.Transactional;
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

    private static  final Logger logger = LoggerFactory.getLogger(DoctorAvailabilityServiceImpl.class);

    private final DoctorAviailabilityRepository availabilityRepository;
    private final DoctorRepository doctorRepository;

    // addavilablity//

    @Override
    public DoctorAvailabilityResponseDTO addAvailability(DoctorAvailabilityRequestDTO dto) {

        logger.info("Adding a Doctor Availability by date start time:{}, end time:{}", dto.getStartTime(), dto.getEndTime());

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> {
                    logger.error("Doctor not found by id:{}",dto.getDoctorId());

      return   new ResourceNotFoundException("Doctor not found");
    });
        DoctorAvailability availability = DoctorAvailabilityMapper.toEntity(dto, doctor);

        availability = availabilityRepository.save(availability);

        logger.info("Doctor Availability set successfully by doctor:{}",dto.getDoctorId());

        return DoctorAvailabilityMapper.toDTO(availability);
    }

    //monthly slote //
    @Override
    @Transactional
    public void generateMonthlySlots(Long doctorId, LocalTime startWork, LocalTime endWork, int slotDurationMinutes) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));

        LocalDate today = LocalDate.now();
        int slotsCreated = 0;
        int slotsSkipped = 0;

        // Generate for the next 30 days
        for (int i = 0; i < 30; i++) {
            LocalDate targetDate = today.plusDays(i);

            // Skip weekends to keep the schedule realistic
            if (targetDate.getDayOfWeek() == DayOfWeek.SATURDAY || targetDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
                continue;
            }

            LocalTime currentTime = startWork;

            // Ensure the slot doesn't go past the endWork time
            while (currentTime.plusMinutes(slotDurationMinutes).isBefore(endWork.plusSeconds(1))) {

                // 1. Check for existing slot to prevent "Duplicate Key" errors in MySQL
                Optional<DoctorAvailability> existing = availabilityRepository
                        .findByDoctorIdAndAvailableDateAndStartTime(doctorId, targetDate, currentTime);

                if (existing.isEmpty()) {
                    DoctorAvailability slot = new DoctorAvailability();
                    slot.setDoctor(doctor);
                    slot.setAvailableDate(targetDate);
                    slot.setStartTime(currentTime);
                    slot.setEndTime(currentTime.plusMinutes(slotDurationMinutes));
                    slot.setIsBooked(false); // New slots are always available

                    availabilityRepository.save(slot);
                    slotsCreated++;
                } else {
                    slotsSkipped++;
                }

                // Move to the next slot start time
                currentTime = currentTime.plusMinutes(slotDurationMinutes);
            }
        }

        // This log helps you verify exactly what happened in your STS/IntelliJ console
        logger.info("Generation Summary for Dr. {}: Created {} new slots, skipped {} duplicates.",
                doctor.getName(), slotsCreated, slotsSkipped);
    }

    // get Doctor availability//

    @Override
    public List<DoctorAvailabilityResponseDTO> getDoctorAvailability(Long doctorId) {

        logger.info("Fetching availability by doctorId:{}",doctorId);

        List<DoctorAvailabilityResponseDTO> availability = availabilityRepository.findByDoctorId(doctorId)
                .stream()
                .map(DoctorAvailabilityMapper::toDTO)
                .toList();

        logger.info("fetched all availability by doctor id");

        return availability;
    }

    @Override
    @Transactional
    public void markDoctorAsAbsent(Long doctorId, LocalDate date) {
        // Optimization: Only fetch slots for the specific date from the DB
        List<DoctorAvailability> slots = availabilityRepository.findByDoctorIdAndAvailableDate(doctorId, date);

        if (slots.isEmpty()) {
            logger.info("No slots found for doctor {} on {}. Nothing to remove.", doctorId, date);
            return;
        }

        for (DoctorAvailability slot : slots) {
            // Only delete slots that aren't already booked
            if (!slot.getIsBooked()) {
                availabilityRepository.delete(slot);
            } else {
                // This is important: If someone already booked, the Admin needs to handle it manually (cancel the appt)
                logger.warn("Slot at {} is already booked. You might need to manually cancel the appointment for doctor {}.",
                        slot.getStartTime(), doctorId);
            }
        }
        logger.info("Successfully cleared unbooked availability for doctor {} on {}", doctorId, date);
    }



    // delete availability//

    @Override
    public void deleteAvailability(Long id) {
        DoctorAvailability slot = availabilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found: " + id));

        if (slot.getIsBooked()) {
            throw new RuntimeException("Cannot delete a slot that is already booked by a patient.");
        }

        availabilityRepository.delete(slot);
        logger.info("Successfully deleted availability with id: {}", id);
    }}