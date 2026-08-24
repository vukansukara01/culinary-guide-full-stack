package com.diplomski.culinaryguidebackend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "google.places")
public class GooglePlacesProperties {

    private String apiKey = "";

    /** Centar Banja Luke (za grid pretrage) */
    private double latitude = 44.7722;

    private double longitude = 17.1910;

    /** Radijus po tački u metrima (manji = manje preklapanja, više pokrivanja grada) */
    private int radiusMeters = 1800;

    /** Stranica po Nearby Search upitu (max 3, ≈ 20 po stranici) */
    private int maxPages = 3;

    /** Ciljani broj jedinstvenih restorana */
    private int maxResults = 200;

    private boolean importReviews = true;

    /** Max Place Details poziva za recenzije */
    private int detailsMaxPlaces = 20;

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public int getRadiusMeters() {
        return radiusMeters;
    }

    public void setRadiusMeters(int radiusMeters) {
        this.radiusMeters = radiusMeters;
    }

    public int getMaxPages() {
        return maxPages;
    }

    public void setMaxPages(int maxPages) {
        this.maxPages = maxPages;
    }

    public int getMaxResults() {
        return maxResults;
    }

    public void setMaxResults(int maxResults) {
        this.maxResults = maxResults;
    }

    public boolean isImportReviews() {
        return importReviews;
    }

    public void setImportReviews(boolean importReviews) {
        this.importReviews = importReviews;
    }

    public int getDetailsMaxPlaces() {
        return detailsMaxPlaces;
    }

    public void setDetailsMaxPlaces(int detailsMaxPlaces) {
        this.detailsMaxPlaces = detailsMaxPlaces;
    }
}
