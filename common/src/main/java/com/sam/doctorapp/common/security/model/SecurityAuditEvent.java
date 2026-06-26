package com.sam.doctorapp.common.security.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SecurityAuditEvent {
    private final String eventType;
    private final String email;
    private final String ipAddress;
    private final String details;
    private final boolean success;
    private final LocalDateTime timestamp;
}
