package com.sam.doctorapp.doctor.repository;

import com.sam.doctorapp.doctor.model.DoctorAvailability;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {

    @EntityGraph(value = "DoctorAvailability.doctor", type = EntityGraph.EntityGraphType.LOAD)
    List<DoctorAvailability> findByDoctorId(Long doctorId);

    @EntityGraph(value = "DoctorAvailability.doctor", type = EntityGraph.EntityGraphType.LOAD)
    Optional<DoctorAvailability> findByDoctorIdAndAvailableDateAndStartTime(Long doctorId, LocalDate date, LocalTime time);

    @EntityGraph(value = "DoctorAvailability.doctor", type = EntityGraph.EntityGraphType.LOAD)
    List<DoctorAvailability> findByDoctorIdAndAvailableDate(Long doctorId, LocalDate date);
}
