package com.sam.doctorapp.dto.docter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorResponseDTO {

    private Long id;

    private String name;

    private String specialization;

    private Integer experience;

    private Long userId;
}