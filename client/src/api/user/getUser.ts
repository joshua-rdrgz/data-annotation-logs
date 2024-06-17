import { request } from '@/api/request';
import { UserDTO } from '@/api/user/types';

export const getUser = (): Promise<UserDTO> => {
  return request({
    method: 'GET',
    url: '/api/v1/users/me',
  });
};
