import { ErrorResponse } from '@/api/auth/types';
import { EntityChangeResponse } from '@/api/request';
import {
  EmailResetVerificationRequest,
  verifyNewEmail,
} from '@/api/user/verifyNewEmail';
import { QueryKeys } from '@/config/QueryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const useVerifyNewEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<
    EntityChangeResponse,
    AxiosError<ErrorResponse>,
    EmailResetVerificationRequest
  >({
    mutationFn: verifyNewEmail,
    onSuccess: () => {
      toast.success(
        'Successfully changed and verified your new email.  Please log in again with it!',
      );
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
    },
  });
};
