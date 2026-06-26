package com.sam.doctorapp.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RefreshTokenRequestDTO {
    @NotBlank
    private String refreshToken;
}
