import { UserDTO } from '@/api/user/types';
import { updateUser } from '@/api/user/updateUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QueryKeys } from '@/config/QueryKeys';
import toast from 'react-hot-toast';
import { ErrorResponse } from '@/api/auth/types';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserDTO,
    AxiosError<ErrorResponse>,
    Omit<UserDTO, 'email'>
  >({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
      toast.success('User settings updated successfully');
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'Failed to update user settings';
      toast.error(errorMessage);
    },
  });
};
