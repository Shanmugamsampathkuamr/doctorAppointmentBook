package com.sam.doctorapp.auth.service;

import com.sam.doctorapp.auth.dto.AuthResponseDTO;
import com.sam.doctorapp.auth.dto.LoginRequestDTO;

public interface AuthService {
    AuthResponseDTO login(LoginRequestDTO dto);
}
