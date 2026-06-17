package com.sam.doctorapp.service.autherservice;

import com.sam.doctorapp.dto.loging.AuthResponseDTO;
import com.sam.doctorapp.dto.loging.LoginRequestDTO;
import com.sam.doctorapp.model.User;
import com.sam.doctorapp.repository.UserRepository;
import com.sam.doctorapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 1. Generate the token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        // 2. UPDATED: Pass all 4 fields (token, role, id, name)
        return new AuthResponseDTO(
                token,
                user.getRole().name(),
                user.getId(),
                user.getName() // <--- DON'T FORGET THE NAME
        );
    }
}
