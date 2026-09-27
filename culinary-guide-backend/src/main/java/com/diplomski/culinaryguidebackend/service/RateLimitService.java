package com.diplomski.culinaryguidebackend.service;

import com.diplomski.culinaryguidebackend.config.RateLimitProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Fixed-window rate limiting preko Redisa (INCR + EXPIRE).
 * Brojač se čuva u memoriji Redis kontejnera — brzo i dijeljeno
 * između eventualnih više instanci aplikacije.
 */
@Service
public class RateLimitService {

    private static final Logger log = LoggerFactory.getLogger(RateLimitService.class);
    private static final String KEY_PREFIX = "rate-limit:";

    private final StringRedisTemplate stringRedisTemplate;
    private final RateLimitProperties properties;

    public RateLimitService(StringRedisTemplate stringRedisTemplate, RateLimitProperties properties) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.properties = properties;
    }

    /**
     * @return true ako je zahtjev dozvoljen, false ako je limit prekoračen
     */
    public boolean tryConsume(String clientIp, String bucket, int limit) {
        if (!properties.isEnabled()) {
            return true;
        }

        String key = KEY_PREFIX + bucket + ":" + clientIp;

        try {
            Long count = stringRedisTemplate.opsForValue().increment(key);
            if (count == null) {
                return true;
            }

            if (count == 1L) {
                stringRedisTemplate.expire(key, Duration.ofSeconds(properties.getWindowSeconds()));
            }

            return count <= limit;
        } catch (Exception ex) {
            // Fail-open: ako Redis nije dostupan, ne blokiraj API tokom razvoja/odbrane
            log.warn("Rate limit provjera nije uspjela (Redis?). Dozvoljavam zahtjev. {}", ex.getMessage());
            return true;
        }
    }

    public int resolveLimit(String requestUri) {
        if (requestUri != null && requestUri.startsWith("/api/auth")) {
            return properties.getAuthLimit();
        }
        return properties.getApiLimit();
    }

    public String resolveBucket(String requestUri) {
        if (requestUri != null && requestUri.startsWith("/api/auth")) {
            return "auth";
        }
        return "api";
    }

    public int getWindowSeconds() {
        return properties.getWindowSeconds();
    }
}
