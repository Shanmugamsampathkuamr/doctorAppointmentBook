package com.sam.doctorapp.service.autherservice;

import com.sam.doctorapp.dto.loging.AuthResponseDTO;
import com.sam.doctorapp.dto.loging.LoginRequestDTO;

public interface AuthService {
    AuthResponseDTO login(LoginRequestDTO dto);
}
