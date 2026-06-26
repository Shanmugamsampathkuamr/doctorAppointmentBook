package com.sam.doctorapp.common.security;

import com.sam.doctorapp.common.security.model.TokenBlacklist;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private static final String PREFIX = "token_blacklist:";
    private final RedisTemplate<String, Object> redisTemplate;

    public void blacklist(String jti, long ttlMillis) {
        redisTemplate.opsForValue().set(PREFIX + jti, "blacklisted", ttlMillis, TimeUnit.MILLISECONDS);
    }

    public boolean isBlacklisted(String jti) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(PREFIX + jti));
    }
}
