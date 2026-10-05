package com.hirenza.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "VerySecretKeyForHirenza123!@#"; // In prod, inject via @Value
    private final Algorithm algorithm = Algorithm.HMAC256(SECRET);

    public String generateToken(String email, String role) {
        return JWT.create()
                .withSubject(email)
                .withClaim("role", role)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
                .sign(algorithm);
    }

    public String extractEmail(String token) {
        return JWT.require(algorithm).build().verify(token).getSubject();
    }
    
    public String extractRole(String token) {
        return JWT.require(algorithm).build().verify(token).getClaim("role").asString();
    }
}
