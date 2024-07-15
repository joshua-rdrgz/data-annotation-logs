import { EntityChangeResponse, request } from '@/api/request';

export interface EmailResetVerificationRequest {
  token: string;
  userId: string;
}

/**
 * Function for verifying the user's new email address.
 * @param data EmailResetVerificationRequest, the data to send over
 * @returns EntityChangeResponse, the data received
 */
export const verifyNewEmail = (
  data: EmailResetVerificationRequest,
): Promise<EntityChangeResponse> => {
  return request({
    method: 'PUT',
    url: '/api/v1/users/email/verify',
    data,
  });
};
