package com.sam.doctorapp.repository;

import com.sam.doctorapp.model.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public interface DoctorAviailabilityRepository extends JpaRepository<DoctorAvailability,Long> {

    List<DoctorAvailability> findByDoctorId(Long doctorId);

    Optional<DoctorAvailability> findByDoctorIdAndAvailableDateAndStartTime(Long doctorId, LocalDate Date, LocalTime Time);
    List<DoctorAvailability> findByDoctorIdAndAvailableDate(Long doctorId, LocalDate date);
}
