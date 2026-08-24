package com.diplomski.culinaryguidebackend.dto.places;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GooglePlaceResult {

    @JsonProperty("place_id")
    private String placeId;

    private String name;

    @JsonProperty("vicinity")
    private String vicinity;

    @JsonProperty("formatted_address")
    private String formattedAddress;

    private Double rating;

    @JsonProperty("user_ratings_total")
    private Integer userRatingsTotal;

    private List<String> types;

    private GoogleGeometry geometry;

    private List<GooglePhoto> photos;

    private List<GoogleReview> reviews;

    @JsonProperty("editorial_summary")
    private GoogleEditorialSummary editorialSummary;

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVicinity() {
        return vicinity;
    }

    public void setVicinity(String vicinity) {
        this.vicinity = vicinity;
    }

    public String getFormattedAddress() {
        return formattedAddress;
    }

    public void setFormattedAddress(String formattedAddress) {
        this.formattedAddress = formattedAddress;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getUserRatingsTotal() {
        return userRatingsTotal;
    }

    public void setUserRatingsTotal(Integer userRatingsTotal) {
        this.userRatingsTotal = userRatingsTotal;
    }

    public List<String> getTypes() {
        return types;
    }

    public void setTypes(List<String> types) {
        this.types = types;
    }

    public GoogleGeometry getGeometry() {
        return geometry;
    }

    public void setGeometry(GoogleGeometry geometry) {
        this.geometry = geometry;
    }

    public List<GooglePhoto> getPhotos() {
        return photos;
    }

    public void setPhotos(List<GooglePhoto> photos) {
        this.photos = photos;
    }

    public List<GoogleReview> getReviews() {
        return reviews;
    }

    public void setReviews(List<GoogleReview> reviews) {
        this.reviews = reviews;
    }

    public GoogleEditorialSummary getEditorialSummary() {
        return editorialSummary;
    }

    public void setEditorialSummary(GoogleEditorialSummary editorialSummary) {
        this.editorialSummary = editorialSummary;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GoogleGeometry {
        private GoogleLocation location;

        public GoogleLocation getLocation() {
            return location;
        }

        public void setLocation(GoogleLocation location) {
            this.location = location;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GoogleLocation {
        private Double lat;
        private Double lng;

        public Double getLat() {
            return lat;
        }

        public void setLat(Double lat) {
            this.lat = lat;
        }

        public Double getLng() {
            return lng;
        }

        public void setLng(Double lng) {
            this.lng = lng;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GooglePhoto {
        @JsonProperty("photo_reference")
        private String photoReference;

        public String getPhotoReference() {
            return photoReference;
        }

        public void setPhotoReference(String photoReference) {
            this.photoReference = photoReference;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GoogleReview {
        private Integer rating;
        private String text;
        private Long time;

        @JsonProperty("author_name")
        private String authorName;

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public Long getTime() {
            return time;
        }

        public void setTime(Long time) {
            this.time = time;
        }

        public String getAuthorName() {
            return authorName;
        }

        public void setAuthorName(String authorName) {
            this.authorName = authorName;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GoogleEditorialSummary {
        private String overview;

        public String getOverview() {
            return overview;
        }

        public void setOverview(String overview) {
            this.overview = overview;
        }
    }
}
