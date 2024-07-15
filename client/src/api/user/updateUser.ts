import { request } from '@/api/request';
import { UserDTO } from '@/api/user/types';

/**
 * Function for updating the current User's trivial attributes.
 * @param data UserDTO, the data to send over
 * @returns UserDTO, the data received
 */
export const updateUser = (data: Omit<UserDTO, 'email'>): Promise<UserDTO> => {
  return request({
    method: 'PUT',
    url: '/api/v1/users/me',
    data,
  });
};
