package com.diplomski.culinaryguidebackend.repository;

import com.diplomski.culinaryguidebackend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("""
            SELECT r FROM Review r
            LEFT JOIN FETCH r.user
            WHERE r.restaurant.id = :restaurantId
            ORDER BY r.createdAt DESC
            """)
    List<Review> findByRestaurantIdWithUser(@Param("restaurantId") Long restaurantId);

    List<Review> findByRestaurantId(Long restaurantId);
}
