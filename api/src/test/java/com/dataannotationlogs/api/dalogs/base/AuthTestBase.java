package com.dataannotationlogs.api.dalogs.base;

import com.dataannotationlogs.api.dalogs.entity.User;
import com.dataannotationlogs.api.dalogs.repository.user.UserRepository;
import com.dataannotationlogs.api.dalogs.service.auth.JwtService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
public abstract class AuthTestBase extends EmailTestBase {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private User user;
    private Cookie tokenCookie;

    @BeforeEach
    void initializeAuth() {
        user = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .password(passwordEncoder.encode("password"))
                .verified(true)
                .build();
        user = userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getEmail());
        tokenCookie = new Cookie("testtoken", jwtToken);
    }

    protected User getUser() {
        return user;
    }

    protected Cookie getTokenCookie() {
        return tokenCookie;
    }
}