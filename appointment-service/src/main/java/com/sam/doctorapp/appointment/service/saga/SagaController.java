package com.sam.doctorapp.appointment.service.saga;

import com.sam.doctorapp.appointment.model.SagaState;
import com.sam.doctorapp.appointment.repository.SagaStateRepository;
import com.sam.doctorapp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sagas")
@RequiredArgsConstructor
public class SagaController {

    private final SagaStateRepository sagaStateRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<SagaState>>> getAllSagas() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Sagas fetched", sagaStateRepository.findAll()));
    }

    @GetMapping("/{sagaId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SagaState>> getSaga(@PathVariable String sagaId) {
        return sagaStateRepository.findBySagaId(sagaId)
                .map(saga -> ResponseEntity.ok(new ApiResponse<>(true, "Saga found", saga)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<SagaState>>> getSagasByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Sagas fetched", sagaStateRepository.findByAppointmentId(appointmentId)));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<SagaState>>> getSagasByStatus(@PathVariable String status) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Sagas fetched", sagaStateRepository.findByStatus(status)));
    }
}
