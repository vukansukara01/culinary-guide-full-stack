package com.diplomski.culinaryguidebackend.repository;

import com.diplomski.culinaryguidebackend.model.Favorite;
import com.diplomski.culinaryguidebackend.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    boolean existsByUserIdAndRestaurantId(Long userId, Long restaurantId);

    @Modifying
    void deleteByUserIdAndRestaurantId(Long userId, Long restaurantId);

    @Query("""
            SELECT r FROM Favorite f
            JOIN f.restaurant r
            WHERE f.user.id = :userId
            ORDER BY f.createdAt DESC
            """)
    List<Restaurant> findRestaurantsByUserId(@Param("userId") Long userId);

    @Query("SELECT f.restaurant.id FROM Favorite f WHERE f.user.id = :userId")
    List<Long> findRestaurantIdsByUserId(@Param("userId") Long userId);
}
