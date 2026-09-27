package com.diplomski.culinaryguidebackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Email je obavezan.")
    @Email(message = "Unesite validan email.")
    private String email;

    @NotBlank(message = "Lozinka je obavezna.")
    private String password;
}
