import { getUser } from '@/api/user/getUser';
import { QueryKeys } from '@/config/QueryKeys';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  return useQuery({
    queryKey: [QueryKeys.USER],
    queryFn: getUser,
  });
};
