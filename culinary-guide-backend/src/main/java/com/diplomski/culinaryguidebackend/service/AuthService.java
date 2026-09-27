package com.diplomski.culinaryguidebackend.service;

import com.diplomski.culinaryguidebackend.config.AdminProperties;
import com.diplomski.culinaryguidebackend.dto.AuthResponse;
import com.diplomski.culinaryguidebackend.dto.LoginRequest;
import com.diplomski.culinaryguidebackend.dto.RegisterRequest;
import com.diplomski.culinaryguidebackend.model.User;
import com.diplomski.culinaryguidebackend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    public record AuthResult(String token, AuthResponse user) {
    }

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AdminProperties adminProperties;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, AdminProperties adminProperties) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.adminProperties = adminProperties;
    }

    public AuthResponse toResponse(User user) {
        return new AuthResponse(user.getName(), user.getEmail(), adminProperties.isAdmin(user.getEmail()));
    }

    public AuthResult register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Korisnik sa ovim email-om vec postoji!"
            );
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getEmail());
        return new AuthResult(jwtToken, toResponse(user));
    }

    public AuthResult login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Pogresan email ili lozinka!"
                ));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Pogresan email ili lozinka!"
            );
        }

        String jwtToken = jwtService.generateToken(user.getEmail());
        return new AuthResult(jwtToken, toResponse(user));
    }
}
