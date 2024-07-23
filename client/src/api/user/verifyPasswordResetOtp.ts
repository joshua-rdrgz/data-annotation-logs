import { EntityChangeResponse, request } from '@/api/request';

export interface PasswordResetVerifyRequest {
  otp: string;
}

/**
 * Verifies the password reset OTP entered by the user.
 */
export const verifyPasswordResetOtp = (
  data: PasswordResetVerifyRequest,
): Promise<EntityChangeResponse> => {
  return request({
    method: 'PUT',
    url: '/api/v1/users/me/password/verify',
    data,
  });
};
