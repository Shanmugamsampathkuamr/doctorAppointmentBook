package com.sam.doctorapp.security;

import com.sam.doctorapp.model.User;
import com.sam.doctorapp.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        String token = null;
        String email = null;

        // 1. Extract Token
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            try {
                email = jwtUtil.extractEmail(token);
            } catch (Exception e) {
                // Only send error if they tried to provide a token but it's bad
                sendErrorResponse(response, "Session expired. Please login again.");
                return;
            }
        }

        // 2. Authenticate if token exists and context is empty
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var userOpt = userRepository.findByEmail(email);

            if (userOpt.isPresent() && jwtUtil.validateToken(token, userOpt.get().getEmail())) {
                User user = userOpt.get();

                // DECISION: To match .hasAuthority("DOCTOR") in SecurityConfig,
                // remove the "ROLE_" prefix here.
                String roleName = user.getRole().name(); // Results in "DOCTOR", "PATIENT", etc.

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user, // Passing the full user object is better for @AuthenticationPrincipal later
                        null,
                        List.of(new SimpleGrantedAuthority(roleName))
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        // Using escaped quotes for valid JSON
        response.getWriter().write("{\"success\": false, \"message\": \"" + message + "\"}");
    }
}