package com.sam.doctorapp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {





    // 1. Using a secure 256-bit key
    @Value("${jwt.secret}")
    private final String SECRET = "mysecretkeymysecretkeymysecretkey_healthconnect_pune";
    @Value("${jwt.expiration}")
    private final long EXPIRATION = 1000 * 60 * 60 * 10; // Increased to 10 hours for development comfort

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(String email, String role, Long id) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("id", id)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // ✅ ROBUST VALIDATION: Checks both expiration AND the user's identity
    public boolean validateToken(String token, String userEmail) {
        try {
            final String extractedEmail = extractEmail(token);
            Claims claims = getClaims(token);
            boolean isExpired = claims.getExpiration().before(new Date());

            // Check if the email matches AND the token isn't expired
            return (extractedEmail.equals(userEmail) && !isExpired);
        } catch (Exception e) {
            return false;
        }
    }
}