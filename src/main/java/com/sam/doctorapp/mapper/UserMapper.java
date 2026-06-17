package com.sam.doctorapp.mapper;

import com.sam.doctorapp.dto.user.UserRequestDTO;
import com.sam.doctorapp.dto.user.UserResponseDTO;
import com.sam.doctorapp.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserMapper {
    public static User toEntity(UserRequestDTO dto) {
        if (dto == null) return null;
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        // We leave password setting to the Service for encoding
        user.setRole(dto.getRole());
        return user;
    }

    public static UserResponseDTO toDTO(User user) {
        if (user == null) return null;
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        // Safety check for Role
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        return dto;
    }
}
