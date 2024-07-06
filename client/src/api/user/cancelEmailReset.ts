import { request, EntityChangeResponse } from '@/api/request';

export interface CancelEmailResetResponse extends EntityChangeResponse {}

export const cancelEmailReset = async (): Promise<CancelEmailResetResponse> => {
  return request({
    url: '/api/v1/users/me/email/cancel-reset',
    method: 'PUT',
  });
};
