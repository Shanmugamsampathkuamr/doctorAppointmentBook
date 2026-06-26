package com.sam.doctorapp.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChangePasswordRequestDTO {
    @NotBlank
    private String currentPassword;
    @NotBlank
    private String newPassword;
}
