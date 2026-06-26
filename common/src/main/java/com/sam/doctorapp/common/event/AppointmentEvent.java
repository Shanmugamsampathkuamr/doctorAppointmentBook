package com.sam.doctorapp.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentEvent {
    private EventType eventType;
    private Long appointmentId;
    private Long doctorId;
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String doctorName;
    private LocalDateTime appointmentDate;
    private String reason;
    private LocalDateTime timestamp;
}
