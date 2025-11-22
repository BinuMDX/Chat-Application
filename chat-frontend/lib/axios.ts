import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const updateAxiosToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export { updateAxiosToken };
export default api;
