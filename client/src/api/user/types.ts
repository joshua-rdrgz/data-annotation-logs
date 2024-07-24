/**
 * Taken from backend PasswordResetStatus,
 * if that changes this must too!
 */
export enum PasswordResetStatus {
  INACTIVE = 'INACTIVE',
  OTP_SENT = 'OTP_SENT',
  OTP_VERIFIED = 'OTP_VERIFIED',
  OTP_TIMEOUT_COOLDOWN = 'OTP_TIMEOUT_COOLDOWN',
  OTP_COMPLETE_COOLDOWN = 'OTP_COMPLETE_COOLDOWN',
}

/**
 * Taken from backend UserDto,
 * if that changes this must too!
 */
export interface UserDto {
  firstName: string;
  lastName: string;
  email: string;
  pendingEmailChange: boolean;
  pendingEmail?: string;
  passwordResetStatus: PasswordResetStatus;
  cooldownMinsRemaining?: number;
}
