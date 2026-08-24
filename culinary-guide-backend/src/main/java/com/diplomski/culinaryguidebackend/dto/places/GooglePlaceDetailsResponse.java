package com.diplomski.culinaryguidebackend.dto.places;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GooglePlaceDetailsResponse {

    private String status;

    @JsonProperty("error_message")
    private String errorMessage;

    private GooglePlaceResult result;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public GooglePlaceResult getResult() {
        return result;
    }

    public void setResult(GooglePlaceResult result) {
        this.result = result;
    }
}
