package com.sam.doctorapp.auth.service;

import com.sam.doctorapp.auth.dto.UserRequestDTO;
import com.sam.doctorapp.auth.dto.UserResponseDTO;

import java.util.List;

public interface UserService {
    UserResponseDTO createUser(UserRequestDTO dto);
    List<UserResponseDTO> getAllUsers();
    List<UserResponseDTO> getAllUsers(int page, int size);
    UserResponseDTO getUserById(Long id);
    UserResponseDTO updateUser(Long id, UserRequestDTO dto);
    void deleteUser(Long id);
}
