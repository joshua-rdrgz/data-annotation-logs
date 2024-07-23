import { ErrorResponse } from '@/api/auth/types';
import { EntityChangeResponse } from '@/api/request';
import {
  PasswordResetVerifyRequest,
  verifyPasswordResetOtp,
} from '@/api/user/verifyPasswordResetOtp';
import { QueryKeys } from '@/config/QueryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

/**
 * Hook for verifying the password reset OTP.
 */
export const useVerifyPasswordResetOtp = () => {
  const queryClient = useQueryClient();

  return useMutation<
    EntityChangeResponse,
    AxiosError<ErrorResponse>,
    PasswordResetVerifyRequest
  >({
    mutationFn: verifyPasswordResetOtp,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to verify OTP');
    },
  });
};
