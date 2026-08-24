package com.diplomski.culinaryguidebackend.repository;

import com.diplomski.culinaryguidebackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // Metoda za pronalaženje korisnika po emailu
    boolean existsByEmail(String email); // Provera da li email već postoji prilikom registracije
}
