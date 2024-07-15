import { ErrorResponse } from '@/api/auth/types';
import { getUser } from '@/api/user/getUser';
import { UserDTO } from '@/api/user/types';
import { QueryKeys } from '@/config/QueryKeys';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useUser = () => {
  return useQuery<UserDTO, AxiosError<ErrorResponse>, UserDTO>({
    queryKey: [QueryKeys.USER],
    queryFn: getUser,
  });
};
