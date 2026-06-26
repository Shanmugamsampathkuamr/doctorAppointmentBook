package com.sam.doctorapp.appointment.service.saga;

import com.sam.doctorapp.appointment.model.SagaState;
import com.sam.doctorapp.appointment.repository.SagaStateRepository;
import com.sam.doctorapp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sagas")
@RequiredArgsConstructor
public class SagaController {

    private final SagaStateRepository sagaStateRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SagaState>>> getAllSagas() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Sagas fetched", sagaStateRepository.findAll()));
    }

    @GetMapping("/{sagaId}")
    public ResponseEntity<ApiResponse<SagaState>> getSaga(@PathVariable String sagaId) {
        return sagaStateRepository.findBySagaId(sagaId)
                .map(saga -> ResponseEntity.ok(new ApiResponse<>(true, "Saga found", saga)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<ApiResponse<List<SagaState>>> getSagasByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Sagas fetched", sagaStateRepository.findByAppointmentId(appointmentId)));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<SagaState>>> getSagasByStatus(@PathVariable String status) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Sagas fetched", sagaStateRepository.findByStatus(status)));
    }
}
