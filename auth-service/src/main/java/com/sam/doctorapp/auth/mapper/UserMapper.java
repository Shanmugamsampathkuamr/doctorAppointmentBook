package com.sam.doctorapp.auth.mapper;

import com.sam.doctorapp.auth.dto.UserRequestDTO;
import com.sam.doctorapp.auth.dto.UserResponseDTO;
import com.sam.doctorapp.auth.model.User;

public class UserMapper {
    public static User toEntity(UserRequestDTO dto) {
        if (dto == null) return null;
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        return user;
    }

    public static UserResponseDTO toDTO(User user) {
        if (user == null) return null;
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        return dto;
    }
}
