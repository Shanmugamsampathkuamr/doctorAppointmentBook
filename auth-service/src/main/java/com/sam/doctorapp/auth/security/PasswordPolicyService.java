package com.sam.doctorapp.auth.security;

import com.sam.doctorapp.auth.entity.PasswordHistory;
import com.sam.doctorapp.auth.repository.PasswordHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PasswordPolicyService {

    @Value("${security.password.min-length:8}")
    private int minLength;

    @Value("${security.password.history-count:5}")
    private int historyCount;

    @Value("${security.password.expiry-days:90}")
    private int expiryDays;

    private final PasswordHistoryRepository passwordHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    public void validatePassword(String rawPassword, Long userId) {
        if (rawPassword.length() < minLength) {
            throw new IllegalArgumentException(
                    "Password must be at least " + minLength + " characters long");
        }
        if (!rawPassword.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter");
        }
        if (!rawPassword.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("Password must contain at least one lowercase letter");
        }
        if (!rawPassword.matches(".*\\d.*")) {
            throw new IllegalArgumentException("Password must contain at least one digit");
        }
        if (!rawPassword.matches(".*[!@#$%^&*(),.?\":{}|<>_+\\-=\\[\\];'].*")) {
            throw new IllegalArgumentException("Password must contain at least one special character");
        }

        if (userId != null) {
            List<PasswordHistory> recentPasswords = passwordHistoryRepository
                    .findTop5ByUserIdOrderByCreatedAtDesc(userId);
            for (PasswordHistory history : recentPasswords) {
                if (passwordEncoder.matches(rawPassword, history.getPassword())) {
                    throw new IllegalArgumentException(
                            "Password must not match any of your last " + historyCount + " passwords");
                }
            }
        }
    }

    public boolean isPasswordExpired(LocalDateTime passwordChangedAt) {
        return passwordChangedAt != null &&
               passwordChangedAt.plusDays(expiryDays).isBefore(java.time.LocalDateTime.now());
    }
}
