package com.sam.doctorapp.common.security;

import com.sam.doctorapp.common.security.model.SecurityAuditEvent;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SecurityAuditService {

    private static final Logger auditLog = LoggerFactory.getLogger("SECURITY_AUDIT");

    public void logEvent(String eventType, String email, HttpServletRequest request, String details, boolean success) {
        String ip = request != null ? request.getRemoteAddr() : "unknown";
        SecurityAuditEvent event = new SecurityAuditEvent(eventType, email, ip, details, success, LocalDateTime.now());
        auditLog.info("{} | user={} | ip={} | success={} | details={}",
                event.getEventType(), event.getEmail(), event.getIpAddress(),
                event.isSuccess(), event.getDetails());
    }

    public void logEvent(String eventType, String email, String ip, String details, boolean success) {
        SecurityAuditEvent event = new SecurityAuditEvent(eventType, email, ip, details, success, LocalDateTime.now());
        auditLog.info("{} | user={} | ip={} | success={} | details={}",
                event.getEventType(), event.getEmail(), event.getIpAddress(),
                event.isSuccess(), event.getDetails());
    }
}
