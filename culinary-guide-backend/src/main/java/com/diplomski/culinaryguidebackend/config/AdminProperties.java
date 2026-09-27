package com.diplomski.culinaryguidebackend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

/**
 * Administratori se određuju listom email adresa (app.admin.emails / env ADMIN_EMAILS).
 * Prazna lista = niko nema pristup /api/admin/**.
 */
@ConfigurationProperties(prefix = "app.admin")
public class AdminProperties {

    private List<String> emails = new ArrayList<>();

    public boolean isAdmin(String email) {
        if (email == null) {
            return false;
        }
        return emails.stream()
                .map(String::trim)
                .anyMatch(adminEmail -> !adminEmail.isEmpty() && adminEmail.equalsIgnoreCase(email));
    }

    public List<String> getEmails() {
        return emails;
    }

    public void setEmails(List<String> emails) {
        this.emails = emails;
    }
}
