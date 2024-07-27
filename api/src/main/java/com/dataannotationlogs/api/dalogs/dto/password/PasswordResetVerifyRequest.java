package com.dataannotationlogs.api.dalogs.dto.password;

import lombok.Data;
import lombok.NoArgsConstructor;

/** PasswordResetVerifyRequest. */
@Data
@NoArgsConstructor
public class PasswordResetVerifyRequest {
  private String otp;
}
