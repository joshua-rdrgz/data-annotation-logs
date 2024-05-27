import { request } from '@/api/request';

export type SignUpRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type SignUpResponse = {
  status: string;
  message: string;
};

/**
 * Function for signup POST request using the /api/v1/auth/register endpoint.
 * @param data SignUpRequest, the data to send over
 * @returns SignUpResponse, the data received
 */
export async function signup(data: SignUpRequest): Promise<SignUpResponse> {
  return request({
    method: 'POST',
    url: '/api/v1/auth/register',
    data,
  });
}
