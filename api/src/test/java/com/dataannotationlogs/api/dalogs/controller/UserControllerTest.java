package com.dataannotationlogs.api.dalogs.controller;

import com.dataannotationlogs.api.dalogs.base.AuthTestBase;
import com.dataannotationlogs.api.dalogs.dto.email_reset.EmailResetRequest;
import com.dataannotationlogs.api.dalogs.dto.email_reset.EmailResetVerificationRequest;
import com.dataannotationlogs.api.dalogs.dto.user.UserDTO;
import com.dataannotationlogs.api.dalogs.entity.EmailResetToken;
import com.dataannotationlogs.api.dalogs.entity.User;
import com.dataannotationlogs.api.dalogs.repository.email_reset_token.EmailResetTokenRepository;
import com.dataannotationlogs.api.dalogs.repository.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class UserControllerTest extends AuthTestBase {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailResetTokenRepository emailResetTokenRepository;

    /**
     * Test that the GET /me endpoint returns the correct user information.
     */
    @Test
    void getCurrentUser_whenLoggedIn_shouldReturnCurrentUser() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/users/me")
                .cookie(getTokenCookie()))
                .andExpect(status().isOk())
                .andReturn();

        UserDTO userDTO = objectMapper.readValue(result.getResponse().getContentAsString(), UserDTO.class);
        assertEquals(getUser().getFirstName(), userDTO.getFirstName());
        assertEquals(getUser().getLastName(), userDTO.getLastName());
        assertEquals(getUser().getEmail(), userDTO.getEmail());
    }

    /**
     * Test that the PUT /me endpoint updates the user information correctly.
     */
    @Test
    void updateCurrentUser_whenLoggedIn_shouldUpdateUser() throws Exception {
        UserDTO userDTO = UserDTO.builder()
                .firstName("Jane")
                .lastName("Doe")
                .build();

        MvcResult result = mockMvc.perform(put("/api/v1/users/me")
                .cookie(getTokenCookie())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isOk())
                .andReturn();

        UserDTO updatedUserDTO = objectMapper.readValue(result.getResponse().getContentAsString(), UserDTO.class);
        assertEquals(userDTO.getFirstName(), updatedUserDTO.getFirstName());
        assertEquals(userDTO.getLastName(), updatedUserDTO.getLastName());
    }

    /**
     * Test that the PUT /me endpoint does not update the email.
     */
    @Test
    void updateCurrentUser_whenEmailIsProvided_shouldNotUpdateEmail() throws Exception {
        UserDTO userDTO = UserDTO.builder()
                .email("jane@example.com")
                .build();

        mockMvc.perform(put("/api/v1/users/me")
                .cookie(getTokenCookie())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isBadRequest());
    }

    /**
     * Test that the PUT /me/email endpoint sends an email reset token.
     */
    @Test
    void sendEmailResetToken_whenLoggedIn_shouldSendEmailResetToken() throws Exception {
        EmailResetRequest emailResetRequest = new EmailResetRequest();
        emailResetRequest.setEmail("jane@example.com");

        mockMvc.perform(put("/api/v1/users/me/email")
                .cookie(getTokenCookie())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emailResetRequest)))
                .andExpect(status().isOk())
                .andReturn();

        // Verify that the email was sent
        assertEquals(1, greenMail.getReceivedMessages().length);
    }

    /**
     * Test that the PUT /me/email endpoint fails if a token already exists.
     */
    @Test
    void sendEmailResetToken_whenTokenAlreadyExists_shouldFail() throws Exception {
        EmailResetRequest emailResetRequest = new EmailResetRequest();
        emailResetRequest.setEmail("jane@example.com");

        // Manually create an existing email reset token
        EmailResetToken emailResetToken = EmailResetToken.builder()
                .user(getUser())
                .token(passwordEncoder.encode("token"))
                .newEmail(emailResetRequest.getEmail())
                .expiryDate(LocalDateTime.now().plusMinutes(30))
                .build();
        emailResetTokenRepository.save(emailResetToken);

        mockMvc.perform(put("/api/v1/users/me/email")
                .cookie(getTokenCookie())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emailResetRequest)))
                .andExpect(status().isBadRequest());

        // Verify that no email was sent
        assertEquals(0, greenMail.getReceivedMessages().length);
    }

    /**
     * Test that the PUT /email/verify endpoint changes the email.
     */
    @Test
    void changeEmail_whenValidTokenIsProvided_shouldChangeEmail() throws Exception {
        String email = "jane@example.com";

        // Manually create an existing email reset token
        EmailResetToken emailResetToken = EmailResetToken.builder()
                .user(getUser())
                .token(passwordEncoder.encode("token"))
                .newEmail(email)
                .expiryDate(LocalDateTime.now().plusMinutes(30))
                .build();
        emailResetTokenRepository.save(emailResetToken);

        EmailResetVerificationRequest emailResetVerificationRequest = new EmailResetVerificationRequest();
        emailResetVerificationRequest.setToken("token");

        mockMvc.perform(put("/api/v1/users/email/verify")
                .cookie(getTokenCookie())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emailResetVerificationRequest)))
                .andExpect(status().isOk());

        // Verify that the email was changed
        User updatedUser = userRepository.findFirstById(getUser().getId());
        assertEquals(email, updatedUser.getEmail());
    }

    /**
     * Test that the PUT /email/verify endpoint fails with an invalid token.
     */
    @Test
    void changeEmail_whenInvalidTokenIsProvided_shouldNotChangeEmail() throws Exception {
        EmailResetVerificationRequest emailResetVerificationRequest = new EmailResetVerificationRequest();
        emailResetVerificationRequest.setToken("invalid-token");

        mockMvc.perform(put("/api/v1/users/email/verify")
                .cookie(getTokenCookie())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emailResetVerificationRequest)))
                .andExpect(status().isBadRequest());

        // Verify that the email was not changed
        User updatedUser = userRepository.findFirstById(getUser().getId());
        assertEquals(getUser().getEmail(), updatedUser.getEmail());
    }
}