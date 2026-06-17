package com.sam.doctorapp.service.docter;

import com.sam.doctorapp.dto.docter.DoctorRequestDTO;
import com.sam.doctorapp.dto.docter.DoctorResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface DoctorService {

    DoctorResponseDTO createDoctor(DoctorRequestDTO dto);

    List<DoctorResponseDTO> getAllDoctors();

    DoctorResponseDTO getDoctorById(Long id);

    DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO dto);

    List<DoctorResponseDTO> findBySpecialization(String specialization);

    List<DoctorResponseDTO> searchDoctors(String specialization, Integer experience);

    Page<DoctorResponseDTO> searchDoctorsDynamic(String specialization, Integer experience , int page, int size);

    Page<DoctorResponseDTO> getAllDoctors(int page, int size);

    void deleteDoctor(Long id);
}
