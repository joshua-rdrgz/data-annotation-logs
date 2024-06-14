package com.dataannotationlogs.api.dalogs.controller;

import com.dataannotationlogs.api.dalogs.base.EmailTestBase;
import com.dataannotationlogs.api.dalogs.dto.auth.login.LoginAuthRequest;
import com.dataannotationlogs.api.dalogs.dto.auth.register.RegisterAuthRequest;
import com.dataannotationlogs.api.dalogs.entity.User;
import com.dataannotationlogs.api.dalogs.entity.VerificationToken;
import com.dataannotationlogs.api.dalogs.repository.user.UserRepository;
import com.dataannotationlogs.api.dalogs.repository.verification_token.VerificationTokenRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.internet.MimeMessage;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@AutoConfigureMockMvc
public class AuthControllerTest extends EmailTestBase {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private RegisterAuthRequest validRegistrationRequest;
    private LoginAuthRequest validLoginRequest;

    @BeforeEach
    public void setup() {
        validRegistrationRequest = RegisterAuthRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .password("password123")
                .build();

        validLoginRequest = LoginAuthRequest.builder()
                .email("john@example.com")
                .password("password123")
                .build();
    }

    @Test
    public void registerUser_withValidData_shouldCreateUser() throws Exception {
        // Test: Register a new user with valid data
        // Expected: User should be created successfully
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegistrationRequest)))
                .andExpect(status().isOk());

        // Verify that the email was sent
        MimeMessage[] receivedMessages = greenMail.getReceivedMessages();
        assertEquals(1, receivedMessages.length);
        assertEquals("john@example.com", receivedMessages[0].getAllRecipients()[0].toString());
    }

    @Test
    public void registerUser_withExistingEmail_shouldReturnError() throws Exception {
        // Test: Register a new user with an existing email
        // Expected: User creation should fail with an appropriate error message
        userRepository.save(User.builder()
                .email("john@example.com")
                .password(passwordEncoder.encode("password123"))
                .verified(true)
                .build());

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegistrationRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void loginUser_withValidCredentials_shouldLoginSuccessfully() throws Exception {
        // Test: Login with valid credentials
        // Expected: User should be logged in successfully
        userRepository.save(User.builder()
                .email("john@example.com")
                .password(passwordEncoder.encode("password123"))
                .verified(true)
                .build());

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isOk());
    }

    @Test
    public void loginUser_withInvalidCredentials_shouldReturnError() throws Exception {
        // Test: Login with invalid credentials
        // Expected: Login should fail with an appropriate error message
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void loginUser_withUnverifiedAccount_shouldReturnError() throws Exception {
        // Test: Login with an unverified account
        // Expected: Login should fail with an appropriate error message
        userRepository.save(User.builder()
                .email("john@example.com")
                .password(passwordEncoder.encode("password123"))
                .verified(false)
                .build());

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void verifyAccount_withValidToken_shouldVerifyAccount() throws Exception {
        // Test: Verify an account with a valid token
        // Expected: Account should be verified successfully
        User user = userRepository.save(User.builder().email("john@example.com")
                .password(passwordEncoder.encode("password123")).verified(false).build());
        String token = UUID.randomUUID().toString();

        verificationTokenRepository.save(VerificationToken.builder()
                .userId(user.getId())
                .user(user)
                .token(passwordEncoder.encode(token))
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build());

        mockMvc.perform(
                MockMvcRequestBuilders.post("/api/v1/auth/verify?token={token}&userId={userId}", token, user.getId()))
                .andExpect(status().isOk());
    }

    @Test
    public void verifyAccount_withInvalidToken_shouldReturnError() throws Exception {
        // Test: Verify an account with an invalid token
        // Expected: Account verification should fail with an appropriate error message
        User user = userRepository.save(User.builder()
                .email("john@example.com")
                .password(passwordEncoder.encode("password123"))
                .verified(false)
                .build());

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/verify?token={token}&userId={userId}",
                "invalid_token", user.getId()))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void resendVerificationEmail_withValidEmail_shouldSendEmail() throws Exception {
        // Test: Resend verification email with a valid email
        // Expected: Verification email should be sent successfully
        userRepository.save(User.builder()
                .email("john@example.com")
                .password(passwordEncoder.encode("password123"))
                .verified(false)
                .build());

        mockMvc.perform(
                MockMvcRequestBuilders.post("/api/v1/auth/resend-verification?email={email}", "john@example.com"))
                .andExpect(status().isOk());

        // Verify that the email was sent
        MimeMessage[] receivedMessages = greenMail.getReceivedMessages();
        assertEquals(1, receivedMessages.length);
        assertEquals("john@example.com", receivedMessages[0].getAllRecipients()[0].toString());
    }
}