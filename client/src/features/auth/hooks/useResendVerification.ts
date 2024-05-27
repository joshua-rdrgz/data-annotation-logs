import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  resendVerificationEmail,
  type ResendVerificationEmailResponse,
} from '@/api/auth/resendVerificationEmail';
import { ErrorResponse } from '@/api/auth/types';
import { AxiosError } from 'axios';

export const useResendVerification = () => {
  return useMutation<
    ResendVerificationEmailResponse,
    AxiosError<ErrorResponse>,
    string
  >({
    mutationFn: resendVerificationEmail,
    mutationKey: ['auth', 'resend-verification'],
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => toast.error(error.message),
  });
};
