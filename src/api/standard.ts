import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const standard = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true
});

standard.interceptors.request.use((config) => {
  const headerPayload = Cookies.get('headerPayload')
  if (headerPayload) {
    config.headers.Authorization = `Bearer ${headerPayload}`;
  }
  return config;
});

standard.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    Cookies.remove('headerPayload');
    if (error.response?.data?.message === 'Unauthorized') {
      window.location.href = '/login';
    } else {
      toast.error(error.response?.data?.message);
    }
  }
  else {
    toast.error(error.response?.data?.message);
  }
  return Promise.reject(error);
});


export { standard };