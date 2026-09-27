package com.diplomski.culinaryguidebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/** Podaci o korisniku za frontend — JWT ide isključivo u httpOnly kolačić, nikad u tijelo odgovora */
@Getter
@AllArgsConstructor
public class AuthResponse {
    private String name;
    private String email;
    /** Samo za prikaz UI-a — stvarna provjera je na backendu (hasRole("ADMIN")) */
    private boolean admin;
}
