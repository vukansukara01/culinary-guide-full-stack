package com.diplomski.culinaryguidebackend.service;

import com.diplomski.culinaryguidebackend.dto.RestaurantPageResponse;
import com.diplomski.culinaryguidebackend.model.Restaurant;
import com.diplomski.culinaryguidebackend.repository.RestaurantRepository;
import com.diplomski.culinaryguidebackend.repository.RestaurantSpecifications;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Point;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.domain.geo.Metrics;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String REDIS_GEO_KEY = "banjaluka:restaurants:geo";

    public RestaurantService(RestaurantRepository restaurantRepository, RedisTemplate<String, Object> redisTemplate) {
        this.restaurantRepository = restaurantRepository;
        this.redisTemplate = redisTemplate;
    }

    public List<Restaurant> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        syncGeoIndex(restaurants);
        return restaurants;
    }

    @Cacheable(
            value = "restaurants",
            key = "#page + '-' + #size + '-' + (#sort ?: '') + '-' + (#cuisine ?: '') + '-' + (#minRating ?: '') + '-' + (#q ?: '')"
    )
    public RestaurantPageResponse getRestaurantsPage(
            int page,
            int size,
            String sort,
            String cuisine,
            Double minRating,
            String q) {
        int safePage = Math.max(page, 0);
        int safeSize = size <= 0 ? 20 : Math.min(size, 100);

        Pageable pageable = PageRequest.of(safePage, safeSize, resolveSort(sort));

        if (safePage == 0) {
            syncGeoIndex(restaurantRepository.findAll());
        }

        Specification<Restaurant> spec = Specification
                .where(RestaurantSpecifications.cuisineContains(cuisine))
                .and(RestaurantSpecifications.minRating(minRating))
                .and(RestaurantSpecifications.nameContains(q));

        Page<Restaurant> result = restaurantRepository.findAll(spec, pageable);

        return new RestaurantPageResponse(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isFirst(),
                result.isLast()
        );
    }

    public List<String> getCuisineTypes() {
        return restaurantRepository.findDistinctCuisineTypes();
    }

    public List<Restaurant> getRestaurantsNearby(Double lat, Double lon, Double radiusKm) {
        Point korisnikovaLokacija = new Point(lon, lat);
        Distance radijusUdaljenosti = new Distance(radiusKm, Metrics.KILOMETERS);
        Circle krugPretrage = new Circle(korisnikovaLokacija, radijusUdaljenosti);

        GeoResults<RedisGeoCommands.GeoLocation<Object>> rezultati =
                redisTemplate.opsForGeo().radius(REDIS_GEO_KEY, krugPretrage);

        List<Long> pronadjeniIdjevi = new ArrayList<>();
        if (rezultati != null) {
            rezultati.forEach(res -> {
                String restaurantIdStr = res.getContent().getName().toString();
                pronadjeniIdjevi.add(Long.parseLong(restaurantIdStr));
            });
        }

        return restaurantRepository.findAllById(pronadjeniIdjevi);
    }

    @Cacheable(value = "restaurant", key = "#id")
    public Optional<Restaurant> getRestaurantById(Long id) {
        return restaurantRepository.findById(id);
    }

    public List<Restaurant> getRestaurantsByCuisine(String cuisineType) {
        return restaurantRepository.findByCuisineType(cuisineType);
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            sort = "reviews";
        }

        return switch (sort.toLowerCase()) {
            case "rating" -> Sort.by(Sort.Direction.DESC, "averageRating")
                    .and(Sort.by(Sort.Direction.DESC, "reviewCount"))
                    .and(Sort.by("name"));
            case "name" -> Sort.by(Sort.Direction.ASC, "name");
            case "name_desc" -> Sort.by(Sort.Direction.DESC, "name");
            default -> // reviews — najviše recenzija prvo
                    Sort.by(Sort.Direction.DESC, "reviewCount")
                            .and(Sort.by(Sort.Direction.DESC, "averageRating"))
                            .and(Sort.by("name"));
        };
    }

    private void syncGeoIndex(List<Restaurant> restaurants) {
        for (Restaurant r : restaurants) {
            if (r.getLatitude() != null && r.getLongitude() != null && r.getId() != null) {
                Point point = new Point(r.getLongitude(), r.getLatitude());
                redisTemplate.opsForGeo().add(REDIS_GEO_KEY, point, r.getId().toString());
            }
        }
    }
}
