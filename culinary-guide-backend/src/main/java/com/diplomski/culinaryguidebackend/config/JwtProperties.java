package com.diplomski.culinaryguidebackend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /** HMAC-SHA256 ključ, najmanje 32 bajta. Postavlja se kroz JWT_SECRET ili application-local.properties */
    private String secret = "";

    /** Trajanje tokena (i kolačića) u milisekundama — podrazumijevano 24h */
    private long expirationMs = 1000L * 60 * 60 * 24;

    private String cookieName = "culinary_guide_token";

    /** true u produkciji (HTTPS); false za lokalni razvoj preko http://localhost */
    private boolean cookieSecure = false;

    /** Lax kada su frontend i backend na istom sajtu; None (uz Secure) ako su na različitim domenima */
    private String cookieSameSite = "Lax";

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }

    public String getCookieName() {
        return cookieName;
    }

    public void setCookieName(String cookieName) {
        this.cookieName = cookieName;
    }

    public boolean isCookieSecure() {
        return cookieSecure;
    }

    public void setCookieSecure(boolean cookieSecure) {
        this.cookieSecure = cookieSecure;
    }

    public String getCookieSameSite() {
        return cookieSameSite;
    }

    public void setCookieSameSite(String cookieSameSite) {
        this.cookieSameSite = cookieSameSite;
    }
}
