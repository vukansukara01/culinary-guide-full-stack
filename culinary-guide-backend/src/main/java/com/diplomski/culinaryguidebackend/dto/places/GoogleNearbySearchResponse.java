package com.diplomski.culinaryguidebackend.dto.places;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GoogleNearbySearchResponse {

    private String status;

    @JsonProperty("next_page_token")
    private String nextPageToken;

    @JsonProperty("error_message")
    private String errorMessage;

    private List<GooglePlaceResult> results;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNextPageToken() {
        return nextPageToken;
    }

    public void setNextPageToken(String nextPageToken) {
        this.nextPageToken = nextPageToken;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public List<GooglePlaceResult> getResults() {
        return results;
    }

    public void setResults(List<GooglePlaceResult> results) {
        this.results = results;
    }
}
