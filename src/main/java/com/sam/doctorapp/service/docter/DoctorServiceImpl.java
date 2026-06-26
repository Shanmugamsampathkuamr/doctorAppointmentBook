package com.sam.doctorapp.service.docter;


import com.sam.doctorapp.dto.docter.DoctorRequestDTO;
import com.sam.doctorapp.dto.docter.DoctorResponseDTO;
import com.sam.doctorapp.enums.Role;
import com.sam.doctorapp.exception.ResourceNotFoundException;
import com.sam.doctorapp.mapper.DoctorMapper;
import com.sam.doctorapp.model.Doctor;
import com.sam.doctorapp.model.User;
import com.sam.doctorapp.repository.DoctorRepository;
import com.sam.doctorapp.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.sam.doctorapp.specification.DoctorSpecification;

import java.util.List;


@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private static final Logger logger =
            LoggerFactory.getLogger(DoctorServiceImpl.class);

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;


    // creat a docter //

    @Override
    @Transactional // Ensures atomicity: both save or neither saves
    public DoctorResponseDTO createDoctor(DoctorRequestDTO dto) {
        logger.info("Admin onboarding new doctor: {}", dto.getEmail());

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("A user with this email already exists");
        }

        // 1. Create the Login Account (User Table)
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        // We encode it for the DB, but we'll use dto.getPassword() for the email
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.DOCTOR);

        User savedUser = userRepository.save(user);

        // 2. Create the Medical Profile (Doctor Table)
        Doctor doctor = new Doctor();
        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setExperience(dto.getExperience());
        doctor.setUser(savedUser); // Links to the User we just created

        doctor = doctorRepository.save(doctor);
        logger.info("Doctor profile linked to User ID: {}", savedUser.getId());

        // 3. TRIGGER EMAIL (New Step)
        // We pass the raw password from the DTO so the doctor can actually log in
        sendWelcomeEmail(dto.getEmail(), dto.getName(), dto.getPassword());

        // 4. Map to DTO for Frontend
        DoctorResponseDTO response = new DoctorResponseDTO();
        response.setId(doctor.getId());
        response.setName(doctor.getName());
        response.setSpecialization(doctor.getSpecialization());
        response.setExperience(doctor.getExperience());
        response.setUserId(savedUser.getId());

        return response;
    }

    // get all docter //

    @Override
    public List<DoctorResponseDTO> getAllDoctors() {

        logger.info("Fetching all doctors");

        List<DoctorResponseDTO> doctors = doctorRepository.findAll()
                .stream()
                .map(DoctorMapper::toDTO)
                .toList();

        logger.info("Total doctors fetched: {}", doctors.size());

        return doctors;
    }


    // get Docter by id //

    @Override
    public DoctorResponseDTO getDoctorById(Long id) {

        logger.info("Fetching doctor with id: {}", id);

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Doctor not found with id: {}", id);
                    return new ResourceNotFoundException("Doctor not found");
                });

        return DoctorMapper.toDTO(doctor);
    }


    // update docter by id//

    @Override
    public DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO dto) {

        logger.info("Updating doctor with id: {}", id);

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Doctor not found for update: {}", id);
                    return new ResourceNotFoundException("Doctor not found");
                });

        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setExperience(dto.getExperience());

        doctor = doctorRepository.save(doctor);

        logger.info("Doctor updated successfully with id: {}", id);

        return DoctorMapper.toDTO(doctor);
    }


    // find by specialization //

    @Override
    public List<DoctorResponseDTO> findBySpecialization(String specialization) {

        logger.info("Searching doctors with specialization: {}", specialization);

        List<DoctorResponseDTO> doctors = doctorRepository
                .findBySpecialization(specialization)
                .stream()
                .map(DoctorMapper::toDTO)
                .toList();

        logger.info("Doctors found: {}", doctors.size());

        return doctors;
    }


    // search dynamicaly //

    @Override
    public Page<DoctorResponseDTO> searchDoctorsDynamic(String specialization, Integer experience, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<Doctor> spec = Specification.where(DoctorSpecification.hasSpecialization(specialization))
                .and(DoctorSpecification.hasExperience(experience));

        return doctorRepository.findAll(spec, pageable)
                .map(DoctorMapper::toDTO);
    }

    // search //

    @Override
    public List<DoctorResponseDTO> searchDoctors(String specialization, Integer experience) {
        logger.info("Searching docters with specialization: {} and experience:{}", specialization, experience);
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

        logger.info("Total docters found :{} ", doctors.size());

        return doctors.stream()
                .map(DoctorMapper::toDTO)
                .toList();
    }


    // get all Docter by page and size//

    @Override
    public Page<DoctorResponseDTO> getAllDoctors(int page, int size) {

        logger.info("Fetching doctors with pagination page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);

        return doctorRepository.findAll(pageable)
                .map(DoctorMapper::toDTO);
    }


    // delete a docter //

    @Override
    public void deleteDoctor(Long id) {

        logger.info("  Attempting to deleting doctor with id: {}", id);

        if (!doctorRepository.existsById(id)) {
            logger.error("Doctor not found for deletion: {}", id);
            throw new ResourceNotFoundException("Doctor not found:" + id);
        }

        doctorRepository.deleteById(id);

        logger.info("Doctor deleted successfully with id: {}", id);
    }

    private void sendWelcomeEmail(String toEmail, String name, String rawPassword) {
        try {
            // Use MimeMessage for HTML support
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Welcome to Medical Portal - Your Account is Ready");

            // Professional HTML Content
            String htmlContent = String.format(
                    "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                            "<h2>Welcome, Dr. %s!</h2>" +
                            "<p>Your medical staff account has been successfully created by the administrator.</p>" +
                            "<div style='background-color: #f4f4f4; padding: 15px; border-radius: 8px;'>" +
                            "<strong>Login Credentials:</strong><br/>" +
                            "Email: <span style='color: #007bff;'>%s</span><br/>" +
                            "Temporary Password: <span style='color: #dc3545;'>%s</span>" +
                            "</div>" +
                            "<p>Please log in to your dashboard and <strong>change your password</strong> immediately for security.</p>" +
                            "<br/>" +
                            "<p>Best Regards,<br/><strong>Admin Control Team</strong></p>" +
                            "</div>",
                    name, toEmail, rawPassword
            );

            helper.setText(htmlContent, true); // 'true' enables HTML parsing

            mailSender.send(message);
            logger.info("✅ Professional welcome email sent to: {}", toEmail);

        } catch (MessagingException e) {
            logger.error("❌ Failed to send HTML email to {}: {}", toEmail, e.getMessage());
            // We log the error but don't throw it, so the Doctor is still
            // created in the DB even if the email service fails.
        }
    }
}
