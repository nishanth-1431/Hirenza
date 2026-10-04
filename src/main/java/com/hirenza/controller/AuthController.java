package com.hirenza.controller;

import com.hirenza.dto.LoginRequest;
import com.hirenza.dto.StudentRequest;
import com.hirenza.dto.VerifyOtpRequest;
import com.hirenza.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody StudentRequest request) {
        authService.signupStudent(request);
        return ResponseEntity.ok(Collections.singletonMap("message", "Signup successful. Please check your email for the OTP."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        String token = authService.verifyOtp(request);
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }
}
