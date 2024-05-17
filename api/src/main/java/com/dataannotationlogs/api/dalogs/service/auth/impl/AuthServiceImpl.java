package com.dataannotationlogs.api.dalogs.service.auth.impl;

import com.dataannotationlogs.api.dalogs.dto.auth.AuthResponse;
import com.dataannotationlogs.api.dalogs.dto.auth.login.LoginAuthRequest;
import com.dataannotationlogs.api.dalogs.dto.auth.register.RegisterAuthRequest;
import com.dataannotationlogs.api.dalogs.entity.User;
import com.dataannotationlogs.api.dalogs.entity.VerificationToken;
import com.dataannotationlogs.api.dalogs.exception.CouldNotVerifyUserException;
import com.dataannotationlogs.api.dalogs.exception.InvalidInputException;
import com.dataannotationlogs.api.dalogs.exception.UnverifiedUserException;
import com.dataannotationlogs.api.dalogs.exception.UserAlreadyExistsException;
import com.dataannotationlogs.api.dalogs.exception.UserAlreadyVerifiedException;
import com.dataannotationlogs.api.dalogs.exception.UserNotFoundException;
import com.dataannotationlogs.api.dalogs.repository.user.UserRepository;
import com.dataannotationlogs.api.dalogs.repository.verification_token.VerificationTokenRepository;
import com.dataannotationlogs.api.dalogs.service.auth.AuthService;
import com.dataannotationlogs.api.dalogs.service.auth.JwtService;
import com.dataannotationlogs.api.dalogs.service.email.EmailService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    @Value("${security.jwt.cookie-token-key}")
    private String TOKEN_KEY;

    @Value("${security.jwt.expiration-time}")
    private String JWT_EXPIRATION_TIME;

    @Override
    @Transactional
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

        // 1. Create User
        var user = User.builder()
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .password(passwordEncoder.encode(entity.getPassword()))
                .verified(false)
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(user);

        // 2. Create User's Verification Token
        Pair<VerificationToken, String> verificationTokenPair = createVerificationToken(user);
        VerificationToken verificationToken = verificationTokenPair.getFirst();
        String token = verificationTokenPair.getSecond();

        verificationTokenRepository.save(verificationToken);

        // 3. Send User Verification Email
        emailService.sendEmail(user.getEmail(), "Verify Your Account",
                createVerificationEmail(user, token));

        return new AuthResponse("success", "User created, please log in!");
    }

    @Override
    public AuthResponse login(LoginAuthRequest entity, HttpServletResponse response) {
        // 1. Authenticate User
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        entity.getEmail(),
                        entity.getPassword()));

        // 2. Check if User is Verified
        var user = userRepository.findByEmail(entity.getEmail());

        if (!user.isVerified()) {
            throw new UnverifiedUserException("User is not verified. Please verify your account first.");
        }

        // 3. Log User In
        var jwtToken = jwtService.generateToken(user.getEmail());

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

    @Override
    @Transactional
    public AuthResponse verifyAccount(String token, UUID userId) {
        VerificationToken verificationToken = verificationTokenRepository.findByUserId(userId);

        if (verificationToken == null
                || !verificationToken.getUserId().equals(userId)
                || !passwordEncoder.matches(token, verificationToken.getToken())
                || verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new CouldNotVerifyUserException("Invalid or expired verification token.");
        }

        userRepository.verifyUser(userId);

        return new AuthResponse("success", "Account verified successfully.");
    }

    @Override
    @Transactional
    public AuthResponse resendVerificationEmail(UUID userId) {
        User user = userRepository.findFirstById(userId);

        if (user == null) {
            throw new UserNotFoundException("User not found.");
        }

        if (user.isVerified()) {
            throw new UserAlreadyVerifiedException("User is already verified.");
        }

        VerificationToken existingToken = verificationTokenRepository.findByUserId(userId);

        if (existingToken != null) {
            verificationTokenRepository.delete(existingToken);
        }

        Pair<VerificationToken, String> verificationTokenPair = createVerificationToken(user);
        VerificationToken verificationToken = verificationTokenPair.getFirst();
        String token = verificationTokenPair.getSecond();
        verificationTokenRepository.save(verificationToken);

        emailService.sendEmail(user.getEmail(), "Verify Your Account",
                createVerificationEmail(user, token));

        return new AuthResponse("success", "Verification email resent successfully.");
    }

    private Pair<VerificationToken, String> createVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);
        VerificationToken verificationToken = VerificationToken.builder()
                .userId(user.getId())
                .user(user)
                .token(passwordEncoder.encode(token))
                .expiryDate(expiryDate)
                .build();

        return Pair.of(verificationToken, token);
    }

    private String createVerificationEmail(User user, String token) {
        String verificationLink = "https://localhost:5173/verify?token=" + token + "&userId=" + user.getId();
        return "Please click the following link to verify your account: " + verificationLink;
    }

}
