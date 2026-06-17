package com.sam.doctorapp.controler;

import com.sam.doctorapp.dto.user.UserRequestDTO;
import com.sam.doctorapp.dto.user.UserResponseDTO;
import com.sam.doctorapp.payload.ApiResponse;
import com.sam.doctorapp.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserControler {

    private final UserService userService;

    // creat the user//



    // get the all users//

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getAllUser(){
        List<UserResponseDTO> users = userService.getAllUsers();

        return ResponseEntity.ok(
                new ApiResponse<>(true,"got the all users ",users)
        );

    }


    // get the use rby id//


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById(@PathVariable Long id){
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true,"got the user by the user id",user)
        );
    }


    // update the user //

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestDTO dto) {

        UserResponseDTO updatedUser = userService.updateUser(id, dto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "User updated successfully", updatedUser)
        );
    }

    //delete the user //

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "User deleted successfully", null));
    }






}