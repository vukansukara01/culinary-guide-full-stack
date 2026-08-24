package com.diplomski.culinaryguidebackend.service;

import com.diplomski.culinaryguidebackend.config.GooglePlacesProperties;
import com.diplomski.culinaryguidebackend.dto.PlacesImportResult;
import com.diplomski.culinaryguidebackend.dto.places.GoogleNearbySearchResponse;
import com.diplomski.culinaryguidebackend.dto.places.GooglePlaceResult;
import com.diplomski.culinaryguidebackend.model.Restaurant;
import com.diplomski.culinaryguidebackend.model.Review;
import com.diplomski.culinaryguidebackend.repository.RestaurantRepository;
import com.diplomski.culinaryguidebackend.repository.ReviewRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class PlacesImportService {

    private static final String REDIS_GEO_KEY = "banjaluka:restaurants:geo";
    private static final Set<String> IGNORED_TYPES = Set.of(
            "point_of_interest", "establishment", "food", "store", "premise"
    );

    /** Samo restorani — bez kafića, pekara i barova */
    private static final List<String> SEARCH_TYPES = List.of("restaurant");

    private final GooglePlacesClient googlePlacesClient;
    private final GooglePlacesProperties properties;
    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public PlacesImportService(
            GooglePlacesClient googlePlacesClient,
            GooglePlacesProperties properties,
            RestaurantRepository restaurantRepository,
            ReviewRepository reviewRepository,
            RedisTemplate<String, Object> redisTemplate) {
        this.googlePlacesClient = googlePlacesClient;
        this.properties = properties;
        this.restaurantRepository = restaurantRepository;
        this.reviewRepository = reviewRepository;
        this.redisTemplate = redisTemplate;
    }

    @CacheEvict(value = {"restaurants", "restaurant"}, allEntries = true)
    public PlacesImportResult importBanjaLukaRestaurants() {
        Map<String, GooglePlaceResult> uniquePlaces = collectPlaces();

        int created = 0;
        int updated = 0;
        int reviewsImported = 0;
        int detailsFetched = 0;

        for (GooglePlaceResult nearby : uniquePlaces.values()) {
            GooglePlaceResult source = nearby;
            boolean isNew = !restaurantRepository.existsByGooglePlaceId(nearby.getPlaceId());

            boolean shouldFetchDetails = properties.isImportReviews()
                    && isNew
                    && detailsFetched < properties.getDetailsMaxPlaces();

            if (shouldFetchDetails) {
                GooglePlaceResult details = googlePlacesClient.placeDetails(nearby.getPlaceId());
                detailsFetched++;
                if (details != null) {
                    source = details;
                }
            }

            Restaurant restaurant = upsertRestaurant(source);

            if (isNew) {
                created++;
                if (properties.isImportReviews() && source.getReviews() != null) {
                    reviewsImported += importGoogleReviews(restaurant, source.getReviews());
                }
            } else {
                updated++;
            }

            indexInRedis(restaurant);
        }

        String message = String.format(
                "Uvezeno iz Google Places (Banja Luka): %d pronađenih, %d novih, %d ažuriranih, %d recenzija (details: %d). Cilj: %d.",
                uniquePlaces.size(), created, updated, reviewsImported, detailsFetched, properties.getMaxResults()
        );
        System.out.println(">> " + message);

        return new PlacesImportResult(uniquePlaces.size(), created, updated, reviewsImported, message);
    }

    /**
     * Google Nearby Search vraća max ~60 po jednoj tački.
     * Zato pretražujemo grid tačaka + više tipova dok ne skupimo maxResults.
     */
    private Map<String, GooglePlaceResult> collectPlaces() {
        Map<String, GooglePlaceResult> uniquePlaces = new LinkedHashMap<>();
        int target = properties.getMaxResults();

        for (double[] center : buildSearchGrid()) {
            if (uniquePlaces.size() >= target) {
                break;
            }
            for (String type : SEARCH_TYPES) {
                if (uniquePlaces.size() >= target) {
                    break;
                }
                collectFromNearby(uniquePlaces, center[0], center[1], type, target);
            }
        }

        // Ograniči na tačno maxResults (zadrži redoslijed)
        if (uniquePlaces.size() > target) {
            Map<String, GooglePlaceResult> limited = new LinkedHashMap<>();
            for (Map.Entry<String, GooglePlaceResult> entry : uniquePlaces.entrySet()) {
                if (limited.size() >= target) {
                    break;
                }
                limited.put(entry.getKey(), entry.getValue());
            }
            return limited;
        }

        return uniquePlaces;
    }

    private void collectFromNearby(
            Map<String, GooglePlaceResult> uniquePlaces,
            double lat,
            double lng,
            String type,
            int target) {
        String pageToken = null;

        for (int page = 0; page < properties.getMaxPages(); page++) {
            if (uniquePlaces.size() >= target) {
                return;
            }
            if (page > 0) {
                sleep(2200);
            }

            GoogleNearbySearchResponse response = googlePlacesClient.nearbySearch(
                    lat,
                    lng,
                    properties.getRadiusMeters(),
                    type,
                    pageToken
            );

            if (response.getResults() != null) {
                for (GooglePlaceResult place : response.getResults()) {
                    if (place.getPlaceId() != null && isRestaurantPlace(place)) {
                        uniquePlaces.putIfAbsent(place.getPlaceId(), place);
                        if (uniquePlaces.size() >= target) {
                            return;
                        }
                    }
                }
            }

            pageToken = response.getNextPageToken();
            if (pageToken == null || pageToken.isBlank()) {
                return;
            }
        }
    }

    /**
     * Mreža tačaka preko Banja Luke (~1.2 km razmak).
     * 0.01 stepena ≈ 1.1 km.
     */
    private List<double[]> buildSearchGrid() {
        double baseLat = properties.getLatitude();
        double baseLng = properties.getLongitude();
        double step = 0.012;

        List<double[]> points = new ArrayList<>();
        for (int dLat = -3; dLat <= 3; dLat++) {
            for (int dLng = -3; dLng <= 3; dLng++) {
                points.add(new double[]{
                        baseLat + (dLat * step),
                        baseLng + (dLng * step)
                });
            }
        }
        return points;
    }

    private Restaurant upsertRestaurant(GooglePlaceResult place) {
        Restaurant restaurant = restaurantRepository.findByGooglePlaceId(place.getPlaceId())
                .orElseGet(Restaurant::new);

        restaurant.setGooglePlaceId(place.getPlaceId());
        restaurant.setName(place.getName());
        restaurant.setAddress(resolveAddress(place));
        restaurant.setCuisineType(mapCuisineType(place.getTypes()));
        restaurant.setDescription(resolveDescription(place));
        restaurant.setAverageRating(place.getRating() != null ? place.getRating() : 0.0);
        // Puni broj Google recenzija (user_ratings_total) — ne samo uzorak tekstova
        if (place.getUserRatingsTotal() != null) {
            restaurant.setReviewCount(place.getUserRatingsTotal());
        } else if (restaurant.getReviewCount() == null) {
            restaurant.setReviewCount(0);
        }

        if (place.getGeometry() != null && place.getGeometry().getLocation() != null) {
            restaurant.setLatitude(place.getGeometry().getLocation().getLat());
            restaurant.setLongitude(place.getGeometry().getLocation().getLng());
        }

        if (place.getPhotos() != null && !place.getPhotos().isEmpty()) {
            String photoRef = place.getPhotos().get(0).getPhotoReference();
            restaurant.setImageUrl(googlePlacesClient.buildPhotoUrl(photoRef));
        }

        return restaurantRepository.save(restaurant);
    }

    private int importGoogleReviews(Restaurant restaurant, List<GooglePlaceResult.GoogleReview> googleReviews) {
        if (googleReviews == null || googleReviews.isEmpty()) {
            return 0;
        }

        List<Review> toSave = new ArrayList<>();
        for (GooglePlaceResult.GoogleReview googleReview : googleReviews) {
            if (googleReview.getRating() == null) {
                continue;
            }

            String comment = googleReview.getText();
            if (comment == null || comment.isBlank()) {
                comment = "Recenzija sa Google Maps (bez teksta).";
            }
            if (googleReview.getAuthorName() != null && !googleReview.getAuthorName().isBlank()) {
                comment = "[" + googleReview.getAuthorName() + "] " + comment;
            }

            LocalDateTime createdAt = LocalDateTime.now();
            if (googleReview.getTime() != null) {
                createdAt = LocalDateTime.ofInstant(
                        Instant.ofEpochSecond(googleReview.getTime()),
                        ZoneId.systemDefault()
                );
            }

            toSave.add(Review.builder()
                    .restaurant(restaurant)
                    .rating(googleReview.getRating())
                    .comment(comment)
                    .createdAt(createdAt)
                    .build());
        }

        reviewRepository.saveAll(toSave);
        // reviewCount ostaje Google user_ratings_total (postavljen u upsertRestaurant)
        return toSave.size();
    }

    private void indexInRedis(Restaurant restaurant) {
        if (restaurant.getId() == null || restaurant.getLatitude() == null || restaurant.getLongitude() == null) {
            return;
        }
        Point point = new Point(restaurant.getLongitude(), restaurant.getLatitude());
        redisTemplate.opsForGeo().add(REDIS_GEO_KEY, point, restaurant.getId().toString());
    }

    /**
     * Zadrži samo mjesta sa Google tipom "restaurant".
     */
    private boolean isRestaurantPlace(GooglePlaceResult place) {
        List<String> types = place.getTypes();
        if (types == null || types.isEmpty()) {
            return true;
        }
        return types.contains("restaurant");
    }

    private String resolveAddress(GooglePlaceResult place) {
        if (place.getFormattedAddress() != null && !place.getFormattedAddress().isBlank()) {
            return place.getFormattedAddress();
        }
        return place.getVicinity();
    }

    private String resolveDescription(GooglePlaceResult place) {
        if (place.getEditorialSummary() != null
                && place.getEditorialSummary().getOverview() != null
                && !place.getEditorialSummary().getOverview().isBlank()) {
            return place.getEditorialSummary().getOverview();
        }
        return "Restoran uvezen iz Google Places — Banja Luka.";
    }

    private String mapCuisineType(List<String> types) {
        if (types == null || types.isEmpty()) {
            return "Restoran";
        }

        for (String type : types) {
            if (IGNORED_TYPES.contains(type)) {
                continue;
            }
            return switch (type) {
                case "restaurant" -> "Restoran";
                case "cafe" -> "Kafić";
                case "bakery" -> "Pekara / Poslastičarnica";
                case "meal_takeaway" -> "Za ponijeti";
                case "meal_delivery" -> "Dostava";
                case "bar" -> "Bar";
                case "night_club" -> "Noćni klub";
                default -> type.replace('_', ' ');
            };
        }
        return "Restoran";
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
