import { request } from '@/api/request';

export interface LogoutResponse {
  statusCode: string;
  status: string;
  message: string;
}

/**
 * Function for logout GET request using the /api/v1/auth/logout endpoint.
 * @returns LogoutResponse, the data received
 */
export async function logout(): Promise<LogoutResponse> {
  return await request({
    method: 'GET',
    url: '/api/v1/auth/logout',
  });
}
