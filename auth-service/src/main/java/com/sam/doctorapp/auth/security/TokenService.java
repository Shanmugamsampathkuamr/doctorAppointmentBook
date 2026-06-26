package com.sam.doctorapp.auth.security;

import com.sam.doctorapp.auth.model.User;
import com.sam.doctorapp.auth.repository.UserRepository;
import com.sam.doctorapp.common.security.JwtUtil;
import com.sam.doctorapp.common.security.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final TokenBlacklistService tokenBlacklistService;

    public TokenPair generateTokenPair(User user) {
        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail(), user.getRole().name(), user.getId());
        return new TokenPair(accessToken, refreshToken);
    }

    @Transactional
    public TokenPair refreshAccessToken(String refreshToken) {
        if (!jwtUtil.isRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Refresh token expired. Please login again.");
        }

        String jti = jwtUtil.extractJti(refreshToken);
        if (tokenBlacklistService.isBlacklisted(jti)) {
            throw new IllegalArgumentException("Refresh token has been revoked. Please login again.");
        }

        String email = jwtUtil.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        tokenBlacklistService.blacklist(jti, jwtUtil.extractExpiration(refreshToken).getTime() - System.currentTimeMillis());

        TokenPair tokens = generateTokenPair(user);
        user.setRefreshToken(tokens.refreshToken());
        userRepository.save(user);

        return tokens;
    }

    @Transactional
    public void logout(String accessToken, String refreshToken) {
        if (accessToken != null) {
            String accessJti = jwtUtil.extractJti(accessToken);
            long accessTtl = jwtUtil.extractExpiration(accessToken).getTime() - System.currentTimeMillis();
            if (accessTtl > 0) {
                tokenBlacklistService.blacklist(accessJti, accessTtl);
            }
        }
        if (refreshToken != null) {
            String refreshJti = jwtUtil.extractJti(refreshToken);
            long refreshTtl = jwtUtil.extractExpiration(refreshToken).getTime() - System.currentTimeMillis();
            if (refreshTtl > 0) {
                tokenBlacklistService.blacklist(refreshJti, refreshTtl);
            }
        }
    }

    public record TokenPair(String accessToken, String refreshToken) {}

    public String extractEmailFromPair(TokenPair pair) {
        return jwtUtil.extractEmail(pair.accessToken());
    }
}
