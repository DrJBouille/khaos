import axios from 'axios';

const authenticatedAPI = axios.create({
  baseURL : import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

authenticatedAPI.interceptors.request.use(async (config) => {
  return config;
});

export { authenticatedAPI };
