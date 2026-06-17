package com.sam.doctorapp.dto.docter;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

@Getter
@Setter
public class DoctorRequestDTO {

    @NotBlank(message = "Doctor name is required")
    private String name;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience;

    // ADD THESE TWO FIELDS:
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Initial password is required")
    private String password;

    // Remove or make this optional since we are creating the user now
    private Long userId;
}