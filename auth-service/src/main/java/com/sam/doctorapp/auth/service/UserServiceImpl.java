package com.sam.doctorapp.auth.service;

import com.sam.doctorapp.auth.dto.UserRequestDTO;
import com.sam.doctorapp.auth.dto.UserResponseDTO;
import com.sam.doctorapp.auth.mapper.UserMapper;
import com.sam.doctorapp.auth.model.User;
import com.sam.doctorapp.auth.repository.UserRepository;
import com.sam.doctorapp.common.exception.ResourceNotFoundException;
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

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO createUser(UserRequestDTO dto) {
        logger.info("Creating user: {}", dto.getEmail());

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        User user = UserMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user = userRepository.save(user);
        return UserMapper.toDTO(user);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(UserMapper::toDTO).toList();
    }

    @Override
    public List<UserResponseDTO> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size)).stream().map(UserMapper::toDTO).toList();
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserMapper.toDTO(user);
    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return UserMapper.toDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }
}
