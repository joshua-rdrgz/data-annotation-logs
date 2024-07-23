import { EntityChangeResponse, request } from '@/api/request';

export interface PasswordChangeRequest {
  newPassword: string;
}

/**
 * Changes the user's password after successful OTP verification.
 */
export const changePassword = (
  data: PasswordChangeRequest,
): Promise<EntityChangeResponse> => {
  return request({
    method: 'PUT',
    url: '/api/v1/users/me/password/change',
    data,
  });
};
