import axios from "axios";
import Cookies from "js-cookie";

const slience = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true
});

slience.interceptors.request.use((config) => {
  const headerPayload = Cookies.get('headerPayload')
  if (headerPayload) {
    config.headers.Authorization = `Bearer ${headerPayload}`;
  }
  return config;
});

slience.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('headerPayload');
      window.location.href = '/login';
    }
    return Promise.reject(error);
});

export { slience };