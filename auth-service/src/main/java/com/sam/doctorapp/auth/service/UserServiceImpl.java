package com.sam.doctorapp.auth.service;

import com.sam.doctorapp.auth.dto.UserRequestDTO;
import com.sam.doctorapp.auth.dto.UserResponseDTO;
import com.sam.doctorapp.auth.entity.PasswordHistory;
import com.sam.doctorapp.auth.mapper.UserMapper;
import com.sam.doctorapp.auth.model.User;
import com.sam.doctorapp.auth.repository.PasswordHistoryRepository;
import com.sam.doctorapp.auth.repository.UserRepository;
import com.sam.doctorapp.auth.security.PasswordPolicyService;
import com.sam.doctorapp.common.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordPolicyService passwordPolicyService;
    private final PasswordHistoryRepository passwordHistoryRepository;

    @Override
    @CacheEvict(value = "users", allEntries = true)
    public UserResponseDTO createUser(UserRequestDTO dto) {
        logger.info("Creating user: {}", dto.getEmail());

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        passwordPolicyService.validatePassword(dto.getPassword(), null);

        User user = UserMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user = userRepository.save(user);
        return UserMapper.toDTO(user);
    }

    @Override
    @Cacheable(value = "users", key = "'all'")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(UserMapper::toDTO).toList();
    }

    @Override
    @Cacheable(value = "users", key = "'page_' + #page + '_' + #size")
    public List<UserResponseDTO> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size)).stream().map(UserMapper::toDTO).toList();
    }

    @Override
    @Cacheable(value = "users", key = "#id")
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserMapper.toDTO(user);
    }

    @Override
    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        User user = userRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            passwordPolicyService.validatePassword(dto.getPassword(), id);
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setPasswordChangedAt(java.time.LocalDateTime.now());
        }
        return UserMapper.toDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long id) {
        User user = userRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setDeleted(true);
        user.setDeletedAt(java.time.LocalDateTime.now());
        user.setEmail(user.getEmail() + ".deleted." + System.currentTimeMillis());
        userRepository.save(user);
        logger.info("User soft-deleted: {}", id);
    }
}
