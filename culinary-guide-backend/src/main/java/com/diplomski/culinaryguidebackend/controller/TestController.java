package com.diplomski.culinaryguidebackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String pozdrav() {
        return "Pozdrav iz Spring Boot-a! Backend za Travel & Culinary Guide Banja Luka je uspešno pokrenut!";
    }
}