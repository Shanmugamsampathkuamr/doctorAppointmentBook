package com.sam.doctorapp.auth.service;

import com.sam.doctorapp.auth.dto.*;
import com.sam.doctorapp.auth.entity.PasswordHistory;
import com.sam.doctorapp.auth.model.User;
import com.sam.doctorapp.auth.repository.PasswordHistoryRepository;
import com.sam.doctorapp.auth.repository.UserRepository;
import com.sam.doctorapp.auth.security.PasswordPolicyService;
import com.sam.doctorapp.auth.security.TokenService;
import com.sam.doctorapp.common.security.LoginAttemptService;
import com.sam.doctorapp.common.security.SecurityAuditService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final LoginAttemptService loginAttemptService;
    private final SecurityAuditService auditService;
    private final PasswordPolicyService passwordPolicyService;
    private final PasswordHistoryRepository passwordHistoryRepository;

    @Override
    @Transactional
    public AuthResponseDTO login(LoginRequestDTO dto, HttpServletRequest request) {
        String email = dto.getEmail().toLowerCase().trim();

        if (loginAttemptService.isLocked(email)) {
            auditService.logEvent("LOGIN_LOCKED", email, request, "Account locked due to multiple failures", false);
            throw new RuntimeException("Account is locked due to too many failed attempts. Try again in 15 minutes.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    loginAttemptService.loginFailed(email);
                    auditService.logEvent("LOGIN_FAILED", email, request, "Invalid email", false);
                    return new RuntimeException("Invalid email or password");
                });

        if (user.isAccountLocked()) {
            if (user.getLockTime() != null &&
                user.getLockTime().plusMinutes(15).isBefore(LocalDateTime.now())) {
                user.setAccountLocked(false);
                user.setFailedAttempts(0);
                user.setLockTime(null);
                userRepository.save(user);
            } else {
                auditService.logEvent("LOGIN_LOCKED", email, request, "Account permanently locked", false);
                throw new RuntimeException("Account is locked. Contact support.");
            }
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            loginAttemptService.loginFailed(email);
            user.setFailedAttempts(user.getFailedAttempts() + 1);
            if (user.getFailedAttempts() >= 5) {
                user.setAccountLocked(true);
                user.setLockTime(LocalDateTime.now());
                log.warn("Account locked due to 5 failed attempts: {}", email);
            }
            userRepository.save(user);
            auditService.logEvent("LOGIN_FAILED", email, request, "Invalid password", false);
            int remaining = loginAttemptService.getRemainingAttempts(email);
            throw new RuntimeException("Invalid email or password. " + remaining + " attempts remaining.");
        }

        if (passwordPolicyService.isPasswordExpired(user.getPasswordChangedAt())) {
            user.setPasswordExpired(true);
            userRepository.save(user);
        }

        loginAttemptService.resetAttempts(email);
        user.setFailedAttempts(0);
        user.setLastLoginAt(LocalDateTime.now());

        TokenService.TokenPair tokens = tokenService.generateTokenPair(user);
        user.setRefreshToken(tokens.refreshToken());
        userRepository.save(user);

        auditService.logEvent("LOGIN_SUCCESS", email, request, "Login successful", true);
        log.info("User logged in: {}", email);

        return new AuthResponseDTO(
                tokens.accessToken(), tokens.refreshToken(),
                user.getRole().name(), user.getId(), user.getName());
    }

    @Override
    public AuthResponseDTO refreshToken(RefreshTokenRequestDTO dto) {
        TokenService.TokenPair tokens = tokenService.refreshAccessToken(dto.getRefreshToken());
        String email = tokenService.extractEmailFromPair(tokens);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new AuthResponseDTO(
                tokens.accessToken(), tokens.refreshToken(),
                user.getRole().name(), user.getId(), user.getName());
    }

    @Override
    public void logout(LogoutRequestDTO dto, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String accessToken = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            accessToken = authHeader.substring(7);
        }
        tokenService.logout(accessToken, dto.getRefreshToken());
        auditService.logEvent("LOGOUT", "unknown", request, "User logged out", true);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        passwordPolicyService.validatePassword(dto.getNewPassword(), userId);

        PasswordHistory history = new PasswordHistory();
        history.setUserId(userId);
        history.setPassword(user.getPassword());
        passwordHistoryRepository.save(history);

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setPasswordChangedAt(LocalDateTime.now());
        user.setPasswordExpired(false);
        userRepository.save(user);

        log.info("Password changed for user: {}", user.getEmail());
    }
}
