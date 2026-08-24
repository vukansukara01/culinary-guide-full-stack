package com.diplomski.culinaryguidebackend.controller;

import com.diplomski.culinaryguidebackend.model.Restaurant;
import com.diplomski.culinaryguidebackend.model.User;
import com.diplomski.culinaryguidebackend.security.UserPrincipal;
import com.diplomski.culinaryguidebackend.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<List<Restaurant>> getFavorites(Authentication authentication) {
        return ResponseEntity.ok(favoriteService.getFavorites(principal(authentication)));
    }

    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getFavoriteIds(Authentication authentication) {
        return ResponseEntity.ok(favoriteService.getFavoriteIds(principal(authentication)));
    }

    @GetMapping("/{restaurantId}")
    public ResponseEntity<Map<String, Boolean>> isFavorite(
            @PathVariable Long restaurantId,
            Authentication authentication) {
        boolean favorite = favoriteService.isFavorite(principal(authentication), restaurantId);
        return ResponseEntity.ok(Map.of("favorite", favorite));
    }

    @PostMapping("/{restaurantId}")
    public ResponseEntity<Map<String, Boolean>> addFavorite(
            @PathVariable Long restaurantId,
            Authentication authentication) {
        favoriteService.addFavorite(principal(authentication), restaurantId);
        return ResponseEntity.ok(Map.of("favorite", true));
    }

    @DeleteMapping("/{restaurantId}")
    public ResponseEntity<Map<String, Boolean>> removeFavorite(
            @PathVariable Long restaurantId,
            Authentication authentication) {
        favoriteService.removeFavorite(principal(authentication), restaurantId);
        return ResponseEntity.ok(Map.of("favorite", false));
    }

    private static User principal(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return principal.getUser();
    }
}
