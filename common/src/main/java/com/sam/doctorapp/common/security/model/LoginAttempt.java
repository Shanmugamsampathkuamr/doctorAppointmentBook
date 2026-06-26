package com.sam.doctorapp.common.security.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.util.concurrent.TimeUnit;

@RedisHash("login_attempts")
@Getter
@Setter
@AllArgsConstructor
public class LoginAttempt {
    @Id
    private String email;
    private int attempts;
    @TimeToLive(unit = TimeUnit.SECONDS)
    private long ttl;
}
