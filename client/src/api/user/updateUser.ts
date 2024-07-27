import { request } from '@/api/request';
import { UserDto } from '@/api/user/types';

/**
 * Function for updating the current User's trivial attributes.
 * @param data UserDto, the data to send over
 * @returns UserDto, the data received
 */
export const updateUser = (data: Omit<UserDto, 'email'>): Promise<UserDto> => {
  return request({
    method: 'PUT',
    url: '/api/v1/users/me',
    data,
  });
};
