import { signup } from '@/api/auth/signup';
import { ErrorResponse } from '@/api/auth/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function useSignUp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    mutationKey: ['auth', 'signup'],
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/login');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error?.response?.data?.message || 'An error occurred during signup.'
      );
      console.error(error);
    },
  });
}