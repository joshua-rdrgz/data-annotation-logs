import { ErrorResponse } from '@/api/auth/types';
import { getUser } from '@/api/user/getUser';
import { UserDto } from '@/api/user/types';
import { QueryKeys } from '@/config/QueryKeys';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useUser = () => {
  return useQuery<UserDto, AxiosError<ErrorResponse>, UserDto>({
    queryKey: [QueryKeys.USER],
    queryFn: getUser,
  });
};
