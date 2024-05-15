package com.dataannotationlogs.api.dalogs.service.auth.impl;

import com.dataannotationlogs.api.dalogs.dto.auth.AuthResponse;
import com.dataannotationlogs.api.dalogs.dto.auth.login.LoginAuthRequest;
import com.dataannotationlogs.api.dalogs.dto.auth.register.RegisterAuthRequest;
import com.dataannotationlogs.api.dalogs.entity.User;
import com.dataannotationlogs.api.dalogs.exception.InvalidInputException;
import com.dataannotationlogs.api.dalogs.exception.UserAlreadyExistsException;
import com.dataannotationlogs.api.dalogs.repository.UserRepository;
import com.dataannotationlogs.api.dalogs.service.auth.AuthService;
import com.dataannotationlogs.api.dalogs.service.auth.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${security.jwt.cookie-token-key}")
    private String TOKEN_KEY;

    @Value("${security.jwt.expiration-time}")
    private String JWT_EXPIRATION_TIME;

    @Override
    public AuthResponse register(RegisterAuthRequest entity) {

        if (entity.getEmail() == null || entity.getEmail().length() < 5) {
            throw new InvalidInputException("Email must be present.  Please add one.");
        }

        if (entity.getPassword() == null || entity.getPassword().length() < 8) {
            throw new InvalidInputException("Password must be at least 8 characters.");
        }

        var potentialUser = userRepository.findByEmail(entity.getEmail());
        if (potentialUser != null) {
            throw new UserAlreadyExistsException("This email is already taken.  Please choose another one.");
        }

        var user = User.builder()
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .password(passwordEncoder.encode(entity.getPassword()))
                .build();
        userRepository.save(user);

        return new AuthResponse("success", "User created, please log in!");
    }

    @Override
    public AuthResponse login(LoginAuthRequest entity, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        entity.getEmail(),
                        entity.getPassword()));

        // If we get here, authentication is successful
        var user = userRepository.findByEmail(entity.getEmail());
        var jwtToken = jwtService.generateToken(user.getEmail());

        // set accessToken to cookie header
        ResponseCookie cookie = ResponseCookie.from(TOKEN_KEY, jwtToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Integer.parseInt(JWT_EXPIRATION_TIME))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new AuthResponse("success", "Successfully logged in.");
    }

    @Override
    public AuthResponse logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(TOKEN_KEY, null)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new AuthResponse("success", "Successfully logged out.");
    }
}
