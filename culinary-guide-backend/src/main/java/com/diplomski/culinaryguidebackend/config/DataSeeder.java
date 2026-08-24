package com.diplomski.culinaryguidebackend.config;

import com.diplomski.culinaryguidebackend.model.Restaurant;
import com.diplomski.culinaryguidebackend.repository.RestaurantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Demo seed samo ako je baza prazna.
 * Za prave podatke koristi: POST /api/admin/import/places (Google Places).
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;

    public DataSeeder(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    @Override
    public void run(String... args) {
        if (restaurantRepository.count() > 0) {
            System.out.println(">> SEEDING PRESKOČEN: Baza već sadrži podatke. Za Google uvoz: POST /api/admin/import/places");
            return;
        }

        Restaurant malaStanica = Restaurant.builder()
                .name("Mala Stanica")
                .description("Ekskluzivni restoran sa modernom evropskom kuhinjom i bogatom vinskom kartom, lociran kod zgrade Vlade.")
                .address("Kralja Petra I Karađorđevića bs")
                .cuisineType("Evropska / Internacionalna")
                .latitude(44.7812)
                .longitude(17.2015)
                .imageUrl("https://example.com/images/mala-stanica.jpg")
                .averageRating(4.8)
                .build();

        Restaurant kazamat = Restaurant.builder()
                .name("Restoran Kazamat")
                .description("Tradicionalni restoran smešten unutar zidina istorijske tvrđave Kastel, na obali reke Vrbas.")
                .address("Tvrđava Kastel, Teodora Kolokotronisa")
                .cuisineType("Tradicionalna / Roštilj")
                .latitude(44.7656)
                .longitude(17.1911)
                .imageUrl("https://example.com/images/kazamat.jpg")
                .averageRating(4.7)
                .build();

        Restaurant picerijaMarchello = Restaurant.builder()
                .name("Picerija Marchello")
                .description("Jedna od najpoznatijih picerija u gradu sa autentičnim italijanskim receptima u blizini centra.")
                .address("Vuka Karadžića 3")
                .cuisineType("Italijanska / Pica")
                .latitude(44.7735)
                .longitude(17.1885)
                .imageUrl("https://example.com/images/marchello.jpg")
                .averageRating(4.5)
                .build();

        restaurantRepository.saveAll(List.of(malaStanica, kazamat, picerijaMarchello));
        System.out.println(">> USPEŠNO IZVRŠEN SEEDING: 3 demo restorana. Za prave podatke: POST /api/admin/import/places");
    }
}
