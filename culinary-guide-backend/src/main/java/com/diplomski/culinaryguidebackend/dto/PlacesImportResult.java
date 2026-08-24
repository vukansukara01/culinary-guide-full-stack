package com.diplomski.culinaryguidebackend.dto;

public class PlacesImportResult {

    private int fetched;
    private int created;
    private int updated;
    private int reviewsImported;
    private String message;

    public PlacesImportResult() {
    }

    public PlacesImportResult(int fetched, int created, int updated, int reviewsImported, String message) {
        this.fetched = fetched;
        this.created = created;
        this.updated = updated;
        this.reviewsImported = reviewsImported;
        this.message = message;
    }

    public int getFetched() {
        return fetched;
    }

    public void setFetched(int fetched) {
        this.fetched = fetched;
    }

    public int getCreated() {
        return created;
    }

    public void setCreated(int created) {
        this.created = created;
    }

    public int getUpdated() {
        return updated;
    }

    public void setUpdated(int updated) {
        this.updated = updated;
    }

    public int getReviewsImported() {
        return reviewsImported;
    }

    public void setReviewsImported(int reviewsImported) {
        this.reviewsImported = reviewsImported;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
