package com.diplomski.culinaryguidebackend.service;

import com.diplomski.culinaryguidebackend.model.Favorite;
import com.diplomski.culinaryguidebackend.model.Restaurant;
import com.diplomski.culinaryguidebackend.model.User;
import com.diplomski.culinaryguidebackend.repository.FavoriteRepository;
import com.diplomski.culinaryguidebackend.repository.RestaurantRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final RestaurantRepository restaurantRepository;

    public FavoriteService(
            FavoriteRepository favoriteRepository,
            RestaurantRepository restaurantRepository) {
        this.favoriteRepository = favoriteRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @Transactional(readOnly = true)
    public List<Restaurant> getFavorites(User user) {
        return favoriteRepository.findRestaurantsByUserId(user.getId());
    }

    @Transactional(readOnly = true)
    public List<Long> getFavoriteIds(User user) {
        return favoriteRepository.findRestaurantIdsByUserId(user.getId());
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(User user, Long restaurantId) {
        return favoriteRepository.existsByUserIdAndRestaurantId(user.getId(), restaurantId);
    }

    @Transactional
    public void addFavorite(User user, Long restaurantId) {
        if (favoriteRepository.existsByUserIdAndRestaurantId(user.getId(), restaurantId)) {
            return;
        }

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Restoran sa ID-jem " + restaurantId + " nije pronađen!"
                ));

        Favorite favorite = Favorite.builder()
                .user(user)
                .restaurant(restaurant)
                .build();
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(User user, Long restaurantId) {
        favoriteRepository.deleteByUserIdAndRestaurantId(user.getId(), restaurantId);
    }
}
