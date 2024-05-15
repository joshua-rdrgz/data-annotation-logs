import axiosModule, { AxiosRequestConfig } from 'axios';

const axios = axiosModule.create({
  timeout: 5000,
});

/**
 * Request function responsible for making requests to
 * DataAnnotation Logging App API.
 * @param config Standard Axios Configuration
 * @returns data from response object, i.e. `response.data`
 */
export async function request(config: AxiosRequestConfig) {
  const response = await axios({ ...config });
  return response.data;
}
