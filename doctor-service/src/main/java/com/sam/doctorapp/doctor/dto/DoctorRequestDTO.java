package com.sam.doctorapp.doctor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DoctorRequestDTO {
    @NotBlank(message = "Doctor name is required")
    private String name;
    @NotBlank(message = "Specialization is required")
    private String specialization;
    @Min(value = 0)
    private Integer experience;
    @Email @NotBlank
    private String email;
    @NotBlank
    private String password;
    private Long userId;
}
