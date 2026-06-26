package com.sam.doctorapp.doctor.service;

import com.sam.doctorapp.common.exception.ResourceNotFoundException;
import com.sam.doctorapp.doctor.dto.DoctorRequestDTO;
import com.sam.doctorapp.doctor.dto.DoctorResponseDTO;
import com.sam.doctorapp.doctor.mapper.DoctorMapper;
import com.sam.doctorapp.doctor.model.Doctor;
import com.sam.doctorapp.doctor.repository.DoctorRepository;
import com.sam.doctorapp.doctor.specification.DoctorSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorServiceImpl.class);
    private final DoctorRepository doctorRepository;

    @Override
    @Transactional
    public DoctorResponseDTO createDoctor(DoctorRequestDTO dto) {
        logger.info("Creating doctor: {}", dto.getEmail());

        Doctor doctor = new Doctor();
        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setExperience(dto.getExperience());
        doctor.setUserId(dto.getUserId());

        doctor = doctorRepository.save(doctor);
        return DoctorMapper.toDTO(doctor);
    }

    @Override
    public List<DoctorResponseDTO> getAllDoctors() {
        return doctorRepository.findAll().stream().map(DoctorMapper::toDTO).toList();
    }

    @Override
    public DoctorResponseDTO getDoctorById(Long id) {
        return DoctorMapper.toDTO(doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found")));
    }

    @Override
    public DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setExperience(dto.getExperience());
        return DoctorMapper.toDTO(doctorRepository.save(doctor));
    }

    @Override
    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found");
        }
        doctorRepository.deleteById(id);
    }

    @Override
    public List<DoctorResponseDTO> findBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization).stream()
                .map(DoctorMapper::toDTO).toList();
    }

    @Override
    public Page<DoctorResponseDTO> searchDoctorsDynamic(String specialization, Integer experience, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Doctor> spec = Specification.where(DoctorSpecification.hasSpecialization(specialization))
                .and(DoctorSpecification.hasExperience(experience));
        return doctorRepository.findAll(spec, pageable).map(DoctorMapper::toDTO);
    }

    @Override
    public Page<DoctorResponseDTO> getAllDoctors(int page, int size) {
        return doctorRepository.findAll(PageRequest.of(page, size)).map(DoctorMapper::toDTO);
    }

    @Override
    public List<DoctorResponseDTO> searchDoctors(String specialization, Integer experience) {
        List<Doctor> doctors;
        if (specialization != null && experience != null) {
            doctors = doctorRepository.findBySpecializationAndExperience(specialization, experience);
        } else if (specialization != null) {
            doctors = doctorRepository.findBySpecialization(specialization);
        } else if (experience != null) {
            doctors = doctorRepository.findByExperience(experience);
        } else {
            doctors = doctorRepository.findAll();
        }
        return doctors.stream().map(DoctorMapper::toDTO).toList();
    }
}
