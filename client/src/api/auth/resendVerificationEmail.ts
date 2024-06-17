import { request } from '@/api/request';

export interface ResendVerificationEmailResponse {
  status: string;
  message: string;
}

export async function resendVerificationEmail(
  email: string,
): Promise<ResendVerificationEmailResponse> {
  const response = await request({
    method: 'POST',
    url: '/api/v1/auth/resend-verification',
    params: { email },
  });
  return response;
}
