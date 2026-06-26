package com.sam.doctorapp.appointment.client;

import com.sam.doctorapp.appointment.client.fallback.UserServiceClientFallbackFactory;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "auth-service", fallbackFactory = UserServiceClientFallbackFactory.class)
public interface UserServiceClient {
    @GetMapping("/api/users/{id}")
    Map<String, Object> getUserById(@PathVariable("id") Long id);
}
