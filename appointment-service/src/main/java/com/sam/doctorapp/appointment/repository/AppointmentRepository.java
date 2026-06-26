package com.sam.doctorapp.appointment.repository;

import com.sam.doctorapp.appointment.model.Appointment;
import com.sam.doctorapp.common.enums.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long>, JpaSpecificationExecutor<Appointment> {
    boolean existsByDoctorIdAndAppointmentDate(Long doctorId, LocalDateTime date);
    boolean existsByDoctorIdAndAppointmentDateAndStatus(Long doctorId, LocalDateTime date, AppointmentStatus status);
    boolean existsByPatientIdAndAppointmentDateAndStatus(Long patientId, LocalDateTime date, AppointmentStatus status);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    Page<Appointment> findAll(Pageable pageable);
}
