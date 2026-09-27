package com.diplomski.culinaryguidebackend.security;

import com.diplomski.culinaryguidebackend.config.AdminProperties;
import com.diplomski.culinaryguidebackend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AdminProperties adminProperties;

    public CustomUserDetailsService(UserRepository userRepository, AdminProperties adminProperties) {
        this.userRepository = userRepository;
        this.adminProperties = adminProperties;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .map(user -> new UserPrincipal(user, adminProperties.isAdmin(user.getEmail())))
                .orElseThrow(() -> new UsernameNotFoundException("Korisnik nije pronađen: " + email));
    }
}
