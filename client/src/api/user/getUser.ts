import { request } from '@/api/request';
import { UserDto } from '@/api/user/types';

export const getUser = (): Promise<UserDto> => {
  return request({
    method: 'GET',
    url: '/api/v1/users/me',
  });
};
