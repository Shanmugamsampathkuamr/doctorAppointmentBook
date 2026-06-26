package com.sam.doctorapp.auth.dto;

import com.sam.doctorapp.common.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDTO {
    @NotBlank(message = "Name cannot be empty")
    private String name;
    @Email @NotBlank
    private String email;
    @Size(min = 5)
    private String password;
    private Role role;
}
