package com.sam.doctorapp.doctor.specification;

import com.sam.doctorapp.doctor.model.Doctor;
import org.springframework.data.jpa.domain.Specification;

public class DoctorSpecification {
    public static Specification<Doctor> hasSpecialization(String specialization) {
        return (root, query, cb) ->
                (specialization == null || specialization.isEmpty()) ? null :
                        cb.like(cb.lower(root.get("specialization")), "%" + specialization.toLowerCase() + "%");
    }

    public static Specification<Doctor> hasExperience(Integer experience) {
        return (root, query, cb) ->
                experience == null ? null : cb.greaterThanOrEqualTo(root.get("experience"), experience);
    }
}
