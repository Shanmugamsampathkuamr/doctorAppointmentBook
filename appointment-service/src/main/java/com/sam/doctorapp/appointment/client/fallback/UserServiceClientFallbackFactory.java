package com.sam.doctorapp.appointment.client.fallback;

import com.sam.doctorapp.appointment.client.UserServiceClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;

@Slf4j
@Component
public class UserServiceClientFallbackFactory implements FallbackFactory<UserServiceClient> {

    @Override
    public UserServiceClient create(Throwable cause) {
        log.error("Fallback triggered for UserServiceClient: {}", cause.getMessage());
        return new UserServiceClient() {
            @Override
            public Map<String, Object> getUserById(Long id) {
                log.warn("Fallback: getUserById({})", id);
                return Collections.singletonMap("fallback", true);
            }
        };
    }
}
