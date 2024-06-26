import { ErrorResponse } from '@/api/auth/types';
import { EntityChangeResponse } from '@/api/request';
import {
  EmailResetRequest,
  sendEmailResetToken,
} from '@/api/user/sendEmailResetToken';
import { QueryKeys } from '@/config/QueryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const useSendEmailResetToken = () => {
  const queryClient = useQueryClient();

  return useMutation<
    EntityChangeResponse,
    AxiosError<ErrorResponse>,
    EmailResetRequest
  >({
    mutationFn: sendEmailResetToken,
    onSuccess: () => {
      toast.success('Check the new email address to finish updating!', {
        duration: 7000,
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'Failed to update user settings';
      toast.error(errorMessage);
    },
  });
};
