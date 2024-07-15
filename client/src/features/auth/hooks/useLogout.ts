import { LogoutResponse, logout } from '@/api/auth/logout';
import { ErrorResponse } from '@/api/auth/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface UseLogoutMutateOptions {
  showSuccessToast?: boolean;
}

const defaultOptions: UseLogoutMutateOptions = {
  showSuccessToast: true,
};

export function useLogout() {
  const navigate = useNavigate();

  return useMutation<
    LogoutResponse,
    AxiosError<ErrorResponse>,
    UseLogoutMutateOptions | void
  >({
    mutationFn: logout,
    onSuccess(_, variables) {
      navigate('/login');
      const options = { ...defaultOptions, ...variables };
      if (options.showSuccessToast) {
        toast('See you next time!', {
          icon: '👋🏽',
        });
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error?.response?.data?.message || 'An error occurred during logout.',
      );
      console.error(error);
    },
  });
}
