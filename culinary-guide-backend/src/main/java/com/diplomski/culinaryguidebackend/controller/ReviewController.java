package com.diplomski.culinaryguidebackend.controller;

import com.diplomski.culinaryguidebackend.dto.ReviewRequest;
import com.diplomski.culinaryguidebackend.dto.ReviewResponse;
import com.diplomski.culinaryguidebackend.security.UserPrincipal;
import com.diplomski.culinaryguidebackend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(reviewService.getReviewsForRestaurant(restaurantId));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long restaurantId,
            @RequestBody ReviewRequest request,
            Authentication authentication) {

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        ReviewResponse response = reviewService.addReview(restaurantId, request, principal.getUser());
        return ResponseEntity.ok(response);
    }
}
