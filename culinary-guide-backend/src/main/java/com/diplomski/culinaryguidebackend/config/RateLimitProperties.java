package com.diplomski.culinaryguidebackend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.rate-limit")
public class RateLimitProperties {

    /** Uključi/isključi rate limiting */
    private boolean enabled = true;

    /** Opšti API limit (zahtjeva po IP adresi u prozoru) */
    private int apiLimit = 120;

    /** Stroži limit za auth endpoint-e (zaštita od brute-force) */
    private int authLimit = 10;

    /** Trajanje prozora u sekundama */
    private int windowSeconds = 60;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getApiLimit() {
        return apiLimit;
    }

    public void setApiLimit(int apiLimit) {
        this.apiLimit = apiLimit;
    }

    public int getAuthLimit() {
        return authLimit;
    }

    public void setAuthLimit(int authLimit) {
        this.authLimit = authLimit;
    }

    public int getWindowSeconds() {
        return windowSeconds;
    }

    public void setWindowSeconds(int windowSeconds) {
        this.windowSeconds = windowSeconds;
    }
}
