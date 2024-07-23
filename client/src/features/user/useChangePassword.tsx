import { ErrorResponse } from '@/api/auth/types';
import { EntityChangeResponse } from '@/api/request';
import {
  changePassword,
  PasswordChangeRequest,
} from '@/api/user/changePassword';
import { QueryKeys } from '@/config/QueryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

/**
 * Hook for changing the user's password.
 */
export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation<
    EntityChangeResponse,
    AxiosError<ErrorResponse>,
    PasswordChangeRequest
  >({
    mutationFn: changePassword,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });
};
