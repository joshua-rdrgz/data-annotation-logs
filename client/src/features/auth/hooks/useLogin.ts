import { login } from '@/api/auth/login';
import { ErrorResponse } from '@/api/auth/types';
import { ClientRoutes } from '@/config/router';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    mutationKey: ['auth', 'login'],
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(ClientRoutes.DASHBOARD);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error?.response?.data?.message || 'An error occurred during login.'
      );
      console.error(error);
    },
  });
}
