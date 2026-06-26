package com.sam.doctorapp.appointment.specification;

import com.sam.doctorapp.appointment.model.Appointment;
import com.sam.doctorapp.common.enums.AppointmentStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentSpecification {
    public static Specification<Appointment> hasDoctorId(Long doctorId) {
        return (root, query, cb) -> doctorId == null ? null : cb.equal(root.get("doctorId"), doctorId);
    }
    public static Specification<Appointment> hasPatientId(Long patientId) {
        return (root, query, cb) -> patientId == null ? null : cb.equal(root.get("patientId"), patientId);
    }
    public static Specification<Appointment> hasStatus(AppointmentStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
    public static Specification<Appointment> hasDate(LocalDate date) {
        return (root, query, cb) -> {
            if (date == null) return null;
            return cb.between(root.get("appointmentDate"), date.atStartOfDay(), date.atTime(LocalTime.MAX));
        };
    }
}
