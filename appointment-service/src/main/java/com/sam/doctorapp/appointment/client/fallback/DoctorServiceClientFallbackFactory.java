package com.sam.doctorapp.appointment.client.fallback;

import com.sam.doctorapp.appointment.client.DoctorServiceClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.Map;

@Slf4j
@Component
public class DoctorServiceClientFallbackFactory implements FallbackFactory<DoctorServiceClient> {

    @Override
    public DoctorServiceClient create(Throwable cause) {
        log.error("Fallback triggered for DoctorServiceClient: {}", cause.getMessage());
        return new DoctorServiceClient() {
            @Override
            public Map<String, Object> getDoctorById(Long id) {
                log.warn("Fallback: getDoctorById({})", id);
                return Collections.singletonMap("fallback", true);
            }

            @Override
            public Map<String, Object> checkSlotAvailability(Long doctorId, LocalDate date, LocalTime startTime) {
                log.warn("Fallback: checkSlotAvailability({},{},{})", doctorId, date, startTime);
                Map<String, Object> result = new java.util.HashMap<>();
                result.put("fallback", true);
                result.put("available", false);
                return result;
            }

            @Override
            public Map<String, Object> markSlotBooked(Long doctorId, LocalDate date, LocalTime startTime) {
                log.warn("Fallback: markSlotBooked({},{},{})", doctorId, date, startTime);
                return Collections.singletonMap("fallback", true);
            }

            @Override
            public Map<String, Object> markSlotUnbooked(Long doctorId, LocalDate date, LocalTime startTime) {
                log.warn("Fallback: markSlotUnbooked({},{},{})", doctorId, date, startTime);
                return Collections.singletonMap("fallback", true);
            }

            @Override
            public Map<String, Object> updateDoctorRating(Long id, Double averageRating, Integer totalReviews) {
                log.warn("Fallback: updateDoctorRating({},{},{})", id, averageRating, totalReviews);
                return Collections.singletonMap("fallback", true);
            }
        };
    }
}
