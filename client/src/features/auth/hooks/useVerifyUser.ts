import { useMutation } from '@tanstack/react-query';
import { verify, VerifyInput, VerifyResponse } from '@/api/auth/verify';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/api/auth/types';

/**
 * Hook to verify user's account.
 */
export function useVerifyUser() {
  return useMutation<VerifyResponse, AxiosError<ErrorResponse>, VerifyInput>({
    mutationFn: async (input) => await verify(input),
    mutationKey: ['auth', 'verify'],
  });
}
