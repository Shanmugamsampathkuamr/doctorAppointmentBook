package com.sam.doctorapp.common.security.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.util.concurrent.TimeUnit;

@RedisHash("token_blacklist")
@Getter
@AllArgsConstructor
public class TokenBlacklist {
    @Id
    private String jti;
    @TimeToLive(unit = TimeUnit.MILLISECONDS)
    private Long ttl;
}
