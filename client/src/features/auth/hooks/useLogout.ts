import { logout } from '@/api/auth/logout';
import { ErrorResponse } from '@/api/auth/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess() {
      navigate('/login');
      toast('See you next time!', {
        icon: '👋🏽',
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error?.response?.data?.message || 'An error occurred during login.',
      );
      console.error(error);
    },
  });
}
