package com.diplomski.culinaryguidebackend.controller;

import com.diplomski.culinaryguidebackend.dto.AuthResponse;
import com.diplomski.culinaryguidebackend.dto.LoginRequest;
import com.diplomski.culinaryguidebackend.dto.RegisterRequest;
import com.diplomski.culinaryguidebackend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Endpoint: POST http://localhost:9090/api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    // Endpoint: POST http://localhost:9090/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
