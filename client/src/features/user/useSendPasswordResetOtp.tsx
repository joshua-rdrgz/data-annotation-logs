import { ErrorResponse } from '@/api/auth/types';
import { EntityChangeResponse } from '@/api/request';
import { sendPasswordResetOtp } from '@/api/user/sendPasswordResetOtp';
import { QueryKeys } from '@/config/QueryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

/**
 * Hook for initiating the password reset process.
 */
export const useSendPasswordResetOtp = () => {
  const queryClient = useQueryClient();

  return useMutation<EntityChangeResponse, AxiosError<ErrorResponse>>({
    mutationFn: sendPasswordResetOtp,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to initiate password reset',
      );
    },
  });
};
