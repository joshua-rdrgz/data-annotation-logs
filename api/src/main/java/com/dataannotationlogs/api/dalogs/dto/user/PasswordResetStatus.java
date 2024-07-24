package com.dataannotationlogs.api.dalogs.dto.user;

/** PasswordResetStatus. */
public enum PasswordResetStatus {
  INACTIVE,
  OTP_SENT,
  OTP_VERIFIED,
  OTP_TIMEOUT_COOLDOWN,
  OTP_COMPLETE_COOLDOWN
}
