import { EntityChangeResponse, request } from '@/api/request';

export interface EmailResetRequest {
  email: string;
}

/**
 * Function for sending the token to reset the user's email.
 * @param data EmailResetRequest, the data to send over
 * @returns EntityChangeResponse, the data received
 */
export const sendEmailResetToken = (
  data: EmailResetRequest,
): Promise<EntityChangeResponse> => {
  return request({
    method: 'PUT',
    url: '/api/v1/users/me/email',
    data,
  });
};
