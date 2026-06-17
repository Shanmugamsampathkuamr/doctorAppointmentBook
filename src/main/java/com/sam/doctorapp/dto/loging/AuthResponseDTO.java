package com.sam.doctorapp.dto.loging;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AuthResponseDTO {
    private String token;
    private String role;     // e.g., "DOCTOR", "PATIENT", "ADMIN"
    private Long id;         // The User ID
    private String name;     // The User's full name for the "Hello" message
}
