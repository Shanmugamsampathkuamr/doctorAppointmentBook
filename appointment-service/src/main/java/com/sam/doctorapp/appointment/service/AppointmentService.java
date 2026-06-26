package com.sam.doctorapp.appointment.service;

import com.sam.doctorapp.appointment.dto.AppointmentRequestDTO;
import com.sam.doctorapp.appointment.dto.AppointmentResponseDTO;
import com.sam.doctorapp.common.enums.AppointmentStatus;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto);
    List<AppointmentResponseDTO> getAllAppointments();
    AppointmentResponseDTO getAppointmentById(Long id);
    List<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorId);
    List<AppointmentResponseDTO> getAppointmentsByPatient(Long patientId);
    Page<AppointmentResponseDTO> searchAppointments(Long doctorId, Long patientId, AppointmentStatus status, LocalDate date, int page, int size);
    AppointmentResponseDTO cancelAppointment(Long id);
    Page<AppointmentResponseDTO> getAllAppointment(int page, int size);
    AppointmentResponseDTO completeAppointment(Long id, String prescription);
    AppointmentResponseDTO updateAppointment(Long id, AppointmentRequestDTO dto);
    AppointmentResponseDTO updateStatus(Long id, AppointmentStatus status);
}
