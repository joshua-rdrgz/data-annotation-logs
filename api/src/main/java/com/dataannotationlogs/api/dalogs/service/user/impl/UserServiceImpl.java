package com.dataannotationlogs.api.dalogs.service.user.impl;

import com.dataannotationlogs.api.dalogs.dto.email.EmailResetRequest;
import com.dataannotationlogs.api.dalogs.dto.email.EmailResetVerificationRequest;
import com.dataannotationlogs.api.dalogs.dto.response.EntityChangeResponse;
import com.dataannotationlogs.api.dalogs.dto.user.UserDto;
import com.dataannotationlogs.api.dalogs.entity.EmailResetToken;
import com.dataannotationlogs.api.dalogs.entity.User;
import com.dataannotationlogs.api.dalogs.repository.emailresettoken.EmailResetTokenRepository;
import com.dataannotationlogs.api.dalogs.repository.user.UserRepository;
import com.dataannotationlogs.api.dalogs.service.email.EmailService;
import com.dataannotationlogs.api.dalogs.service.user.UserService;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** UserServiceImpl. */
@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final EmailResetTokenRepository emailResetTokenRepository;
  private final EmailService emailService;
  private final PasswordEncoder passwordEncoder;

  @Override
  public UserDto getCurrentUser(User user) {
    return UserDto.fromUser(user);
  }

  @Override
  public UserDto updateCurrentUser(User user, UserDto userDto) {
    if (userDto.getEmail() != null) {
      throw new IllegalArgumentException("This endpoint does not support updating emails.");
    }

    User managedUser = userRepository.findFirstById(user.getId());
    managedUser.setFirstName(userDto.getFirstName());
    managedUser.setLastName(userDto.getLastName());

    User updatedUser = userRepository.save(managedUser);

    return UserDto.fromUser(updatedUser);
  }

  @Override
  public EntityChangeResponse sendEmailResetToken(User user, EmailResetRequest emailReset) {
    User managedUser = userRepository.findFirstById(user.getId());

    EmailResetToken existingToken = emailResetTokenRepository.findByUserId(managedUser.getId());
    if (existingToken != null && existingToken.getExpiryDate().isAfter(LocalDateTime.now())) {
      return EntityChangeResponse.builder()
          .statusCode(HttpStatusCode.valueOf(400))
          .status("fail")
          .message("Could not send email reset token. Please try again later.")
          .build();
    }

    String token = UUID.randomUUID().toString();
    EmailResetToken emailResetToken =
        EmailResetToken.builder()
            .user(managedUser)
            .token(passwordEncoder.encode(token))
            .newEmail(emailReset.getEmail())
            .expiryDate(LocalDateTime.now().plusMinutes(30))
            .build();

    emailResetTokenRepository.save(emailResetToken);

    String verificationLink = "http://localhost:5173/verify-change-email?token=" + token;
    emailService.sendEmail(emailReset.getEmail(), "Email Reset Verification", verificationLink);

    return EntityChangeResponse.builder()
        .statusCode(HttpStatusCode.valueOf(200))
        .status("success")
        .message("Email reset token sent successfully.")
        .build();
  }

  @Override
  public EntityChangeResponse changeEmail(
      User user, EmailResetVerificationRequest emailResetVerification) {
    User managedUser = userRepository.findFirstById(user.getId());

    EmailResetToken emailResetToken = emailResetTokenRepository.findByUserId(managedUser.getId());
    if (emailResetToken == null
        || !passwordEncoder.matches(
            emailResetVerification.getToken(), emailResetToken.getToken())) {
      return EntityChangeResponse.builder()
          .statusCode(HttpStatusCode.valueOf(400))
          .status("fail")
          .message("Could not change email.")
          .build();
    }

    managedUser.setEmail(emailResetToken.getNewEmail());
    userRepository.save(managedUser);

    emailResetTokenRepository.delete(emailResetToken);

    return EntityChangeResponse.builder()
        .statusCode(HttpStatusCode.valueOf(200))
        .status("success")
        .message("Email changed successfully.")
        .build();
  }
}
