import { request } from '@/api/request';

export interface VerifyInput {
  token: string;
  userId: string;
}

export interface VerifyResponse {
  status: string;
  message: string;
}

/**
 * Verify user's account by sending a verification token and user ID.
 *
 * @param {VerifyInput} input - Verification input containing token and user ID.
 * @returns {Promise<VerifyResponse>} API response.
 */
export async function verify(input: VerifyInput): Promise<VerifyResponse> {
  return request({
    method: 'POST',
    url: '/api/v1/auth/verify',
    params: input,
  });
}
