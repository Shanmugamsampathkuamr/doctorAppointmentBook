package com.sam.doctorapp.controler;

import com.sam.doctorapp.dto.loging.AuthResponseDTO;
import com.sam.doctorapp.dto.loging.LoginRequestDTO;
import com.sam.doctorapp.dto.loging.OtpRequest;
import com.sam.doctorapp.dto.loging.ResetPasswordRequest;
import com.sam.doctorapp.dto.user.UserRequestDTO;
import com.sam.doctorapp.dto.user.UserResponseDTO;
import com.sam.doctorapp.model.User;
import com.sam.doctorapp.payload.ApiResponse;
import com.sam.doctorapp.repository.UserRepository;
import com.sam.doctorapp.security.JwtUtil;
import com.sam.doctorapp.service.autherservice.AuthService;
import com.sam.doctorapp.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
// 1. ADD THIS: Allows your React app (Port 5173) to talk to this Controller
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final UserRepository userRepository; // Make sure the name matches your repo
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@RequestBody @Valid LoginRequestDTO dto) {
        AuthResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Login successful", response)
        );
    }

    @PostMapping("/register")
    // 2. CONSISTENCY: Wrapped in ResponseEntity with a clear Success status
    public ResponseEntity<ApiResponse<UserResponseDTO>> createUser(@Valid @RequestBody UserRequestDTO dto){
        UserResponseDTO user = userService.createUser(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(true, "User created successfully", user)
        );
    }

    @PutMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Check if OTP matches
        if (user.getResetOtp() == null || !user.getResetOtp().equals(request.getOtp())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "Invalid OTP code", null));
        }

        // 2. Check if OTP has expired
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "OTP has expired. Please request a new one", null));
        }

        // 3. Success! Update password and CLEAR the OTP so it can't be used again
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse<>(true, "Password updated successfully!", null));
    }


    @PostMapping("/forgot-password-otp")
    public ResponseEntity<ApiResponse<String>> sendOtp(@RequestBody OtpRequest request) {
        // 1. Find the user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User with this email not found"));

        // 2. Generate OTP
        String otp = String.valueOf((int)((Math.random() * 900000) + 100000));

        // 3. Save to DB
        user.setResetOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        // 4. SEND THE REAL EMAIL
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("sampathkumar14012005@gmail.com"); // Your admin mail
            message.setTo(request.getEmail());
            message.setSubject("HealthConnect - Password Reset OTP");
            message.setText("Hello " + user.getName() + ",\n\n" +
                    "Your OTP for resetting your password is: " + otp + "\n" +
                    "This code is valid for 5 minutes only.\n\n" +
                    "If you did not request this, please ignore this email.");

            mailSender.send(message);

            System.out.println("Email sent successfully to: " + request.getEmail());
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to send email. Please try again later.", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "OTP sent successfully to your email", null));
    }

    @PostMapping("/admin/add-doctor")
    @PreAuthorize("hasRole('ADMIN')") // Optional: Ensure only Admin can call this
    public ResponseEntity<ApiResponse<UserResponseDTO>> addDoctorByAdmin(@Valid @RequestBody UserRequestDTO dto) {
        // 1. Create the Doctor using your existing service
        UserResponseDTO doctor = userService.createUser(dto);

        // 2. Send Welcome Email with Credentials
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("sampathkumar14012005@gmail.com");
            message.setTo(dto.getEmail()); // The doctor's email
            message.setSubject("Welcome to HealthConnect - Your Doctor Account is Ready");
            message.setText("Hello Dr. " + dto.getName() + ",\n\n" +
                    "An account has been created for you on HealthConnect Pune.\n" +
                    "You can now log in using the following credentials:\n\n" +
                    "Email: " + dto.getEmail() + "\n" +
                    "Password: " + dto.getPassword() + "\n\n" +
                    "Please log in and change your password immediately for security.\n" +
                    "Link: http://localhost:5173/login");

            mailSender.send(message);
            System.out.println("Credentials sent to Doctor: " + dto.getEmail());
        } catch (Exception e) {
            // We don't want to fail the whole request if only the email fails,
            // but we should log it.
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(true, "Doctor added and credentials emailed successfully", doctor)
        );
    }
}