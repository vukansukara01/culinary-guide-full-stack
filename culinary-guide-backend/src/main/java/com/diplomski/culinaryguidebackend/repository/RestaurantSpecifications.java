package com.diplomski.culinaryguidebackend.repository;

import com.diplomski.culinaryguidebackend.model.Restaurant;
import org.springframework.data.jpa.domain.Specification;

public final class RestaurantSpecifications {

    private RestaurantSpecifications() {
    }

    public static Specification<Restaurant> cuisineContains(String cuisine) {
        return (root, query, cb) -> {
            if (cuisine == null || cuisine.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("cuisineType")), "%" + cuisine.toLowerCase() + "%");
        };
    }

    public static Specification<Restaurant> minRating(Double minRating) {
        return (root, query, cb) -> {
            if (minRating == null || minRating <= 0) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("averageRating"), minRating);
        };
    }

    public static Specification<Restaurant> nameContains(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("name")), "%" + q.toLowerCase() + "%");
        };
    }
}
