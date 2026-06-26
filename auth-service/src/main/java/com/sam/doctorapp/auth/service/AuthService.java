package com.sam.doctorapp.auth.service;

import com.sam.doctorapp.auth.dto.*;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    AuthResponseDTO login(LoginRequestDTO dto, HttpServletRequest request);
    AuthResponseDTO refreshToken(RefreshTokenRequestDTO dto);
    void logout(LogoutRequestDTO dto, HttpServletRequest request);
    void changePassword(Long userId, ChangePasswordRequestDTO dto);
}
