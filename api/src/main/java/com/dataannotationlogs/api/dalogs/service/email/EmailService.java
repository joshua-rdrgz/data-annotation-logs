package com.dataannotationlogs.api.dalogs.service.email;

import com.dataannotationlogs.api.dalogs.entity.User;
import java.util.UUID;

/** EmailService. */
public interface EmailService {
  void sendAccountVerificationEmail(User user, String token);

  void sendEmailChangeEmail(String email, String token, UUID userId);

  void sendPasswordResetOtpEmail(String email, String otp);

  void sendAccountDeletedEmail(String email);

  void sendAccountVerificationReminderEmail(String email);
}
