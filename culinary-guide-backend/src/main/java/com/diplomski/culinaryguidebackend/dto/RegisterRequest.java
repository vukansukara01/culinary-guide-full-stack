package com.diplomski.culinaryguidebackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Ime je obavezno.")
    @Size(min = 2, message = "Ime mora imati najmanje 2 karaktera.")
    private String name;

    @NotBlank(message = "Email je obavezan.")
    @Email(message = "Unesite validan email.")
    private String email;

    @NotBlank(message = "Lozinka je obavezna.")
    @Size(min = 6, message = "Lozinka mora imati najmanje 6 karaktera.")
    private String password;
}
