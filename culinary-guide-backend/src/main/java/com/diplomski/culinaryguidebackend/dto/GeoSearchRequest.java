package com.diplomski.culinaryguidebackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GeoSearchRequest {
    private Double latitude;
    private Double longitude;
    private Double radius; // Udaljenost u kilometrima (npr. 1.0 za 1km)
}