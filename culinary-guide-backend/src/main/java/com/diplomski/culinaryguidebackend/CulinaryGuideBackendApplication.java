package com.diplomski.culinaryguidebackend;

import com.diplomski.culinaryguidebackend.config.AdminProperties;
import com.diplomski.culinaryguidebackend.config.GooglePlacesProperties;
import com.diplomski.culinaryguidebackend.config.JwtProperties;
import com.diplomski.culinaryguidebackend.config.RateLimitProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
@EnableConfigurationProperties({GooglePlacesProperties.class, RateLimitProperties.class, JwtProperties.class, AdminProperties.class})
public class CulinaryGuideBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CulinaryGuideBackendApplication.class, args);
    }

}
