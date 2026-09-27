package com.diplomski.culinaryguidebackend.controller;

import com.diplomski.culinaryguidebackend.dto.PlacesImportResult;
import com.diplomski.culinaryguidebackend.service.PlacesImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class PlacesImportController {

    private final PlacesImportService placesImportService;

    public PlacesImportController(PlacesImportService placesImportService) {
        this.placesImportService = placesImportService;
    }

    /**
     * Uvozi restorane iz Google Places API-ja za Banja Luku.
     * POST http://localhost:9090/api/admin/import/places
     */
    @PostMapping("/import/places")
    public ResponseEntity<PlacesImportResult> importPlaces() {
        PlacesImportResult result = placesImportService.importBanjaLukaRestaurants();
        return ResponseEntity.ok(result);
    }
}
