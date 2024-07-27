package com.dataannotationlogs.api.dalogs.repository.passwordresetotp;

import com.dataannotationlogs.api.dalogs.entity.PasswordResetOtp;
import java.util.UUID;

/** PasswordResetOtpRepository. */
public interface PasswordResetOtpRepository {
  PasswordResetOtp save(PasswordResetOtp otp);

  PasswordResetOtp findByUserId(UUID userId);

  void delete(PasswordResetOtp otp);
}
