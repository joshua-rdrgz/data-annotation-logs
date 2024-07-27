import { EntityChangeResponse, request } from '@/api/request';

/**
 * Initiates a password reset by requesting an OTP.
 */
export const sendPasswordResetOtp = (): Promise<EntityChangeResponse> => {
  return request({
    method: 'PUT',
    url: '/api/v1/users/me/password',
  });
};
