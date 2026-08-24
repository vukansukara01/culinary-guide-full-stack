package com.diplomski.culinaryguidebackend.service;

import com.diplomski.culinaryguidebackend.config.GooglePlacesProperties;
import com.diplomski.culinaryguidebackend.dto.places.GoogleNearbySearchResponse;
import com.diplomski.culinaryguidebackend.dto.places.GooglePlaceDetailsResponse;
import com.diplomski.culinaryguidebackend.dto.places.GooglePlaceResult;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class GooglePlacesClient {

    private static final String NEARBY_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    private static final String DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";

    private final RestClient restClient;
    private final GooglePlacesProperties properties;

    public GooglePlacesClient(GooglePlacesProperties properties) {
        this.properties = properties;
        this.restClient = RestClient.create();
    }

    public GoogleNearbySearchResponse nearbySearch(
            double latitude,
            double longitude,
            int radiusMeters,
            String type,
            String pageToken) {
        ensureApiKey();

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(NEARBY_URL)
                .queryParam("key", properties.getApiKey())
                .queryParam("language", "sr");

        if (pageToken != null && !pageToken.isBlank()) {
            builder.queryParam("pagetoken", pageToken);
        } else {
            builder
                    .queryParam("location", latitude + "," + longitude)
                    .queryParam("radius", radiusMeters)
                    .queryParam("type", type);
        }

        GoogleNearbySearchResponse response = restClient.get()
                .uri(builder.build(true).toUri())
                .retrieve()
                .body(GoogleNearbySearchResponse.class);

        validateStatus(response != null ? response.getStatus() : null,
                response != null ? response.getErrorMessage() : null);
        return response;
    }

    public GooglePlaceResult placeDetails(String placeId) {
        ensureApiKey();

        String uri = UriComponentsBuilder
                .fromUriString(DETAILS_URL)
                .queryParam("place_id", placeId)
                .queryParam("fields",
                        "place_id,name,formatted_address,geometry,rating,types,photos,reviews,editorial_summary")
                .queryParam("language", "sr")
                .queryParam("key", properties.getApiKey())
                .build(true)
                .toUriString();

        GooglePlaceDetailsResponse response = restClient.get()
                .uri(uri)
                .retrieve()
                .body(GooglePlaceDetailsResponse.class);

        validateStatus(response != null ? response.getStatus() : null,
                response != null ? response.getErrorMessage() : null);

        return response != null ? response.getResult() : null;
    }

    public String buildPhotoUrl(String photoReference) {
        if (photoReference == null || photoReference.isBlank()) {
            return null;
        }
        return UriComponentsBuilder
                .fromUriString("https://maps.googleapis.com/maps/api/place/photo")
                .queryParam("maxwidth", 800)
                .queryParam("photo_reference", photoReference)
                .queryParam("key", properties.getApiKey())
                .build(true)
                .toUriString();
    }

    private void ensureApiKey() {
        if (properties.getApiKey() == null || properties.getApiKey().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Google Places API key nije postavljen. Dodaj google.places.api-key u application.properties ili GOOGLE_PLACES_API_KEY."
            );
        }
    }

    private void validateStatus(String status, String errorMessage) {
        if (status == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Prazan odgovor od Google Places API-ja");
        }
        if ("OK".equals(status) || "ZERO_RESULTS".equals(status)) {
            return;
        }
        String detail = errorMessage != null ? errorMessage : status;
        throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Google Places API greška: " + detail
        );
    }
}
