package com.sam.doctorapp.service.user;

import com.sam.doctorapp.dto.user.UserRequestDTO;
import com.sam.doctorapp.dto.user.UserResponseDTO;
import com.sam.doctorapp.exception.ResourceNotFoundException;
import com.sam.doctorapp.mapper.UserMapper;
import com.sam.doctorapp.model.User;
import com.sam.doctorapp.repository.DoctorRepository;
import com.sam.doctorapp.repository.ReviewRepository;
import com.sam.doctorapp.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private  static  final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private  final DoctorRepository doctorRepository;
    private final ReviewRepository reviewRepository;

    // creat a user //

    @Override
    public UserResponseDTO createUser(UserRequestDTO dto) {
        logger.info("creating user by name :{} , by role:{}",dto.getName(),dto.getRole());

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        User user = UserMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user = userRepository.save(user);

        logger.info("created user with name:{}",dto.getName());

        return UserMapper.toDTO(user);
    }

    // get all user //


    @Override
    public List<UserResponseDTO> getAllUsers() {
        logger.info("Fetching all users");

        List<UserResponseDTO> users = userRepository.findAll()
                .stream()
                .map(UserMapper::toDTO)
                .toList();

        if(users.isEmpty()){
            logger.warn("No users found");
            throw new ResourceNotFoundException("No users found");
        }

        logger.info("Successfully fetched all users");
        return users;
    }

    @Override
    public List<UserResponseDTO> getAllUsers(int page, int size) {
        logger.info("Fetching all users with pagination page:{}, size:{}", page, size);
        return userRepository.findAll(PageRequest.of(page, size))
                .stream()
                .map(UserMapper::toDTO)
                .toList();
    }

    // get user by id //


    @Override
    public UserResponseDTO getUserById(Long id) {

        logger.info("Fetching the user by id :{}",id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found by this id:{}",id);
                   return new ResourceNotFoundException("User not found");
                });

        logger.info("Fetched user successfuly with id:{}",id);

        return UserMapper.toDTO(user);
    }


    // updateuser //



    @Override
    @Transactional // Good practice for updates
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        logger.info("Updating user with id :{}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found with id :{}", id);
                    return new ResourceNotFoundException("User not found");
                });

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        // Optional: Only update password if provided
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        logger.info("User updated successfully with id:{}", id);

        return UserMapper.toDTO(updatedUser);
    }


    // deleteuser //

    @Override
    @Transactional
    public void deleteUser(Long id) {
        logger.info("Attempting to delete user with id: {}", id);

        // 1. Check if user exists
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }

        // 2. Clear reviews where this user was the Patient (The Writer)
        reviewRepository.deleteByPatientId(id);

        // 3. Clear Doctor profile and everything attached to it
        doctorRepository.findByUserId(id).ifPresent(doctor -> {
            // Clear reviews RECEIVED by this doctor
            reviewRepository.deleteByDoctorId(doctor.getId());
            doctorRepository.delete(doctor);
            doctorRepository.flush();
        });

        // 4. Force repository to push these deletes to the DB NOW
        reviewRepository.flush();

        // 5. Delete the User by ID directly (This is the most important change)
        userRepository.deleteById(id);

        logger.info("Successfully deleted user id: {}", id);
    }
}