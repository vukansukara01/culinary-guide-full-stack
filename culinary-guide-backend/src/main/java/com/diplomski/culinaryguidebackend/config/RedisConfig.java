package com.diplomski.culinaryguidebackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {

        // POZIV BEZ ARGUMENATA: Spring 4.x sam kreira i obezbeđuje ObjectMapper u pozadini
        RedisSerializer<Object> jsonSerializer = RedisSerializer.json();

        // Postavljanje konfiguracije keša sa novim serializerom
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10)) // Keš važi 10 minuta
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(jsonSerializer));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .build();

    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Ključevi u Redisu će biti obični tekstualni stringovi
        template.setKeySerializer(new StringRedisSerializer());
        // Vrednosti (podaci o restoranima) će se pretvarati u JSON preko istog serializer-a kao i keš
        template.setValueSerializer(RedisSerializer.json());

        return template;
    }
}