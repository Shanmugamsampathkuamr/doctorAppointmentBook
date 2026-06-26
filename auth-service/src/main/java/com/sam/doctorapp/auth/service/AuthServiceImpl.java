package com.sam.doctorapp.auth.service;

import com.sam.doctorapp.auth.dto.AuthResponseDTO;
import com.sam.doctorapp.auth.dto.LoginRequestDTO;
import com.sam.doctorapp.auth.model.User;
import com.sam.doctorapp.auth.repository.UserRepository;
import com.sam.doctorapp.common.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponseDTO(token, user.getRole().name(), user.getId(), user.getName());
    }
}
