import { authenticatedAPI } from './axios-interceptor';

export const handleAPIError = ((error: any) => {
  if (error.message === 'Network Error') {
    throw new Error('Network Error. Please try again later.');
  } else if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  } else if (error.response) {
    throw new Error('A server error occurred.');
  } else {
    throw new Error(error.message || 'An unknown error occurred.');
  }
});

export const apiCall = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any
): Promise<T> => {
  try {
    const response = await authenticatedAPI[method](url, data);
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};
