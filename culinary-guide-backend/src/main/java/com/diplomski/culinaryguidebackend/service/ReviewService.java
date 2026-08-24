package com.diplomski.culinaryguidebackend.service;

import com.diplomski.culinaryguidebackend.dto.ReviewRequest;
import com.diplomski.culinaryguidebackend.dto.ReviewResponse;
import com.diplomski.culinaryguidebackend.model.Restaurant;
import com.diplomski.culinaryguidebackend.model.Review;
import com.diplomski.culinaryguidebackend.model.User;
import com.diplomski.culinaryguidebackend.repository.RestaurantRepository;
import com.diplomski.culinaryguidebackend.repository.ReviewRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;

    public ReviewService(ReviewRepository reviewRepository, RestaurantRepository restaurantRepository) {
        this.reviewRepository = reviewRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public List<ReviewResponse> getReviewsForRestaurant(Long restaurantId) {
        return reviewRepository.findByRestaurantIdWithUser(restaurantId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    @CacheEvict(value = {"restaurants", "restaurant"}, allEntries = true)
    public ReviewResponse addReview(Long restaurantId, ReviewRequest request, User user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Morate biti prijavljeni da ostavite recenziju.");
        }

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Restoran sa ID-jem " + restaurantId + " nije pronađen!"
                ));

        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .restaurant(restaurant)
                .user(user)
                .build();

        reviewRepository.save(review);

        List<Review> allReviews = reviewRepository.findByRestaurantId(restaurantId);
        double average = allReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        double roundedAverage = Math.round(average * 10.0) / 10.0;
        restaurant.setAverageRating(roundedAverage);
        int current = restaurant.getReviewCount() == null ? 0 : restaurant.getReviewCount();
        restaurant.setReviewCount(Math.max(current + 1, allReviews.size()));
        restaurantRepository.save(restaurant);

        return toResponse(review);
    }

    private ReviewResponse toResponse(Review review) {
        User user = review.getUser();
        String userName = user != null && user.getName() != null && !user.getName().isBlank()
                ? user.getName()
                : "Google korisnik";

        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt() != null ? review.getCreatedAt().toString() : null)
                .userId(user != null ? user.getId() : null)
                .userName(userName)
                .build();
    }
}
