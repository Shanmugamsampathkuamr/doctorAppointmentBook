package com.sam.doctorapp.controler;

import com.sam.doctorapp.dto.docter.DoctorRequestDTO;
import com.sam.doctorapp.dto.docter.DoctorResponseDTO;
import com.sam.doctorapp.payload.ApiResponse;
import com.sam.doctorapp.service.docter.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;



    // creat the docteor//
    @PostMapping
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> createDoctor(@Valid @RequestBody DoctorRequestDTO dto) {

        DoctorResponseDTO doctor = doctorService.createDoctor(dto);
        return ResponseEntity.ok(
                new ApiResponse<>(true,"DOctor created succesfully",doctor)
        );

    }


    // find the docter by specialization //

    @GetMapping("/specialization/{Specialization}")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> findBySpecialization(@PathVariable String Specialization){
        List<DoctorResponseDTO> doctors = doctorService.findBySpecialization(Specialization);
        return ResponseEntity.ok(new ApiResponse<>(true,"Search succesfully",doctors));
    }


    // get the all  docters by the page //

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>>getAllDoctors(){
        List<DoctorResponseDTO> doctor = doctorService.getAllDoctors();
        return ResponseEntity.ok(
                new ApiResponse<>(true,"Docters fetched successfuly",doctor)
        );
    }


    // search //

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<DoctorResponseDTO>>> searchDoctors(
            @RequestParam(required = false) String specialization, // Fixed spelling
            @RequestParam(required = false) Integer experience,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<DoctorResponseDTO> doctors = doctorService.searchDoctorsDynamic(specialization, experience, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctors fetched successfully", doctors));
    }




    // update the doctors //

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> updateDoctor(@PathVariable Long id,@Valid
                                                          @RequestBody DoctorRequestDTO dto) {
        DoctorResponseDTO doctor = doctorService.updateDoctor(id,dto);

        return ResponseEntity.ok(
                new ApiResponse<>(true,"Updated the old docter into new docter below ",doctor)
        );
    }


    // delete the docter //

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDoctor(@PathVariable Long id) {
        // Just call the service; let the service handle the check
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Doctor deleted successfully",null)
        );
    }



    // get the all doctors by id //
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> getDoctorById(@PathVariable Long id) {
        DoctorResponseDTO doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true,"Doctor fetched successfully",doctor)
        );
    }
}