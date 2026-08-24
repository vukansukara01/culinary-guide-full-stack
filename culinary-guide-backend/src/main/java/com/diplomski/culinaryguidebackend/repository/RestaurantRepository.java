package com.diplomski.culinaryguidebackend.repository;

import com.diplomski.culinaryguidebackend.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>, JpaSpecificationExecutor<Restaurant> {
    List<Restaurant> findByCuisineType(String cuisineType);

    Optional<Restaurant> findByGooglePlaceId(String googlePlaceId);

    boolean existsByGooglePlaceId(String googlePlaceId);

    @Query("select distinct r.cuisineType from Restaurant r where r.cuisineType is not null and r.cuisineType <> '' order by r.cuisineType")
    List<String> findDistinctCuisineTypes();
}
