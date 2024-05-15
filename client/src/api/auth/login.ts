import { request } from '@/api/request';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: string;
  message: string;
};

/**
 * Function for login POST request using the /api/v1/auth/login endpoint.
 * @param data LoginRequest, the data to send over
 * @returns LoginResponse, the data received
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return request({
    method: 'POST',
    url: '/api/v1/auth/login',
    data,
  });
}
