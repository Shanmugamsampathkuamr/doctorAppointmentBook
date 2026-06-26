package com.sam.doctorapp.common.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private static final String PREFIX = "login_attempts:";

    @Value("${security.login.max-attempts:5}")
    private int maxAttempts;

    @Value("${security.login.lockout-duration-minutes:15}")
    private int lockoutDurationMinutes;

    private final RedisTemplate<String, Object> redisTemplate;

    public void loginFailed(String email) {
        String key = PREFIX + email;
        Integer attempts = (Integer) redisTemplate.opsForValue().get(key);
        if (attempts == null) {
            attempts = 0;
        }
        attempts++;
        redisTemplate.opsForValue().set(key, attempts, lockoutDurationMinutes, TimeUnit.MINUTES);
    }

    public boolean isLocked(String email) {
        String key = PREFIX + email;
        Integer attempts = (Integer) redisTemplate.opsForValue().get(key);
        return attempts != null && attempts >= maxAttempts;
    }

    public void resetAttempts(String email) {
        redisTemplate.delete(PREFIX + email);
    }

    public int getRemainingAttempts(String email) {
        String key = PREFIX + email;
        Integer attempts = (Integer) redisTemplate.opsForValue().get(key);
        if (attempts == null) return maxAttempts;
        return Math.max(0, maxAttempts - attempts);
    }
}
