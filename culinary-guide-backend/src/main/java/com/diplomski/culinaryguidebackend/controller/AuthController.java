package com.diplomski.culinaryguidebackend.controller;

import com.diplomski.culinaryguidebackend.config.JwtProperties;
import com.diplomski.culinaryguidebackend.dto.AuthResponse;
import com.diplomski.culinaryguidebackend.dto.LoginRequest;
import com.diplomski.culinaryguidebackend.dto.RegisterRequest;
import com.diplomski.culinaryguidebackend.security.UserPrincipal;
import com.diplomski.culinaryguidebackend.service.AuthService;
import com.diplomski.culinaryguidebackend.service.AuthService.AuthResult;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtProperties jwtProperties;

    public AuthController(AuthService authService, JwtProperties jwtProperties) {
        this.authService = authService;
        this.jwtProperties = jwtProperties;
    }

    // Endpoint: POST http://localhost:9090/api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return withSessionCookie(authService.register(request));
    }

    // Endpoint: POST http://localhost:9090/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return withSessionCookie(authService.login(request));
    }

    // Endpoint: POST http://localhost:9090/api/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, buildCookie("", Duration.ZERO).toString())
                .build();
    }

    // Endpoint: GET http://localhost:9090/api/auth/me — 204 kada korisnik nije prijavljen
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(authService.toResponse(principal.getUser()));
    }

    private ResponseEntity<AuthResponse> withSessionCookie(AuthResult result) {
        ResponseCookie cookie = buildCookie(result.token(), Duration.ofMillis(jwtProperties.getExpirationMs()));
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(result.user());
    }

    private ResponseCookie buildCookie(String value, Duration maxAge) {
        return ResponseCookie.from(jwtProperties.getCookieName(), value)
                .httpOnly(true)
                .secure(jwtProperties.isCookieSecure())
                .sameSite(jwtProperties.getCookieSameSite())
                .path("/")
                .maxAge(maxAge)
                .build();
    }
}
