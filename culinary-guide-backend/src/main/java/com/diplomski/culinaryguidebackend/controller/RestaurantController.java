package com.diplomski.culinaryguidebackend.controller;

import com.diplomski.culinaryguidebackend.dto.GeoSearchRequest;
import com.diplomski.culinaryguidebackend.dto.RestaurantPageResponse;
import com.diplomski.culinaryguidebackend.model.Restaurant;
import com.diplomski.culinaryguidebackend.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    /**
     * GET /api/restaurants?page=0&size=20&sort=reviews&cuisine=Kafić&minRating=4&q=pizza
     * sort: reviews (default) | rating | name | name_desc
     */
    @GetMapping
    public ResponseEntity<RestaurantPageResponse> getRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "reviews") String sort,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(
                restaurantService.getRestaurantsPage(page, size, sort, cuisine, minRating, q)
        );
    }

    @GetMapping("/cuisines")
    public ResponseEntity<List<String>> getCuisineTypes() {
        return ResponseEntity.ok(restaurantService.getCuisineTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        return restaurantService.getRestaurantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cuisine")
    public ResponseEntity<List<Restaurant>> getRestaurantsByCuisine(@RequestParam String type) {
        List<Restaurant> restaurants = restaurantService.getRestaurantsByCuisine(type);
        return ResponseEntity.ok(restaurants);
    }

    @PostMapping("/nearby")
    public ResponseEntity<List<Restaurant>> getRestaurantsNearby(@RequestBody GeoSearchRequest request) {
        List<Restaurant> nearbyRestaurants = restaurantService.getRestaurantsNearby(
                request.getLatitude(),
                request.getLongitude(),
                request.getRadius()
        );
        return ResponseEntity.ok(nearbyRestaurants);
    }
}
