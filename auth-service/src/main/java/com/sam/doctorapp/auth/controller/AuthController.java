package com.sam.doctorapp.auth.controller;

import com.sam.doctorapp.auth.dto.*;
import com.sam.doctorapp.auth.model.User;
import com.sam.doctorapp.auth.repository.UserRepository;
import com.sam.doctorapp.auth.service.AuthService;
import com.sam.doctorapp.auth.service.UserService;
import com.sam.doctorapp.common.dto.ApiResponse;
import com.sam.doctorapp.common.security.SecurityAuditService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final SecurityAuditService auditService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO dto, HttpServletRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", authService.login(dto, request)));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> register(
            @Valid @RequestBody UserRequestDTO dto, HttpServletRequest request) {
        UserResponseDTO user = userService.createUser(dto);
        auditService.logEvent("REGISTER", dto.getEmail(), request, "User registered", true);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "User created successfully", user));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> refresh(
            @Valid @RequestBody RefreshTokenRequestDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed", authService.refreshToken(dto)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            @RequestBody LogoutRequestDTO dto, HttpServletRequest request) {
        authService.logout(dto, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out successfully", null));
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDTO dto,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        authService.changePassword(userId, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password changed successfully", null));
    }

    @PostMapping("/forgot-password-otp")
    public ResponseEntity<ApiResponse<String>> sendOtp(
            @Valid @RequestBody OtpRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User with this email not found"));

        String otp = String.valueOf((int) ((Math.random() * 900000) + 100000));
        user.setResetOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getEmail());
            message.setSubject("HealthConnect - Password Reset OTP");
            message.setText("Hello " + user.getName() + ",\n\nYour OTP: " + otp + "\nValid for 5 minutes.");
            mailSender.send(message);
            auditService.logEvent("PASSWORD_RESET_OTP", request.getEmail(), httpRequest, "OTP sent", true);
        } catch (Exception e) {
            auditService.logEvent("PASSWORD_RESET_OTP", request.getEmail(), httpRequest, "Failed to send email", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to send email", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "OTP sent successfully", null));
    }

    @PutMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResetOtp() == null || !user.getResetOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Invalid OTP", null));
        }
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "OTP has expired", null));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetOtp(null);
        user.setOtpExpiry(null);
        user.setPasswordChangedAt(LocalDateTime.now());
        user.setPasswordExpired(false);
        userRepository.save(user);

        auditService.logEvent("PASSWORD_RESET", request.getEmail(), httpRequest, "Password reset completed", true);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password updated successfully", null));
    }
}
