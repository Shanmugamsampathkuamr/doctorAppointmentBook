package com.sam.doctorapp.common.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Order(1)
public class RateLimitingFilter implements Filter {

    @Value("${security.rate-limit.capacity:20}")
    private int capacity;

    @Value("${security.rate-limit.window-seconds:60}")
    private int windowSeconds;

    private final Map<String, RateLimitEntry> buckets = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getRequestURI();

        if (path.contains("/api/auth/login") || path.contains("/api/auth/register")
                || path.contains("/api/auth/forgot-password-otp")) {
            String ip = httpRequest.getRemoteAddr();
            RateLimitEntry entry = buckets.computeIfAbsent(ip, k -> new RateLimitEntry(capacity));

            if (!entry.tryConsume()) {
                HttpServletResponse httpResponse = (HttpServletResponse) response;
                httpResponse.setStatus(429);
                httpResponse.setContentType("application/json");
                httpResponse.setHeader("Retry-After", String.valueOf(windowSeconds));
                httpResponse.getWriter().write(
                        "{\"success\": false, \"message\": \"Too many requests. Please try again later.\"}");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private static class RateLimitEntry {
        private final int capacity;
        private final AtomicInteger counter;
        private final long windowMillis;
        private volatile long windowStart;

        RateLimitEntry(int capacity) {
            this.capacity = capacity;
            this.counter = new AtomicInteger(0);
            this.windowMillis = 60_000;
            this.windowStart = System.currentTimeMillis();
        }

        synchronized boolean tryConsume() {
            long now = System.currentTimeMillis();
            if (now - windowStart > windowMillis) {
                counter.set(0);
                windowStart = now;
            }
            int current = counter.incrementAndGet();
            return current <= capacity;
        }
    }
}
