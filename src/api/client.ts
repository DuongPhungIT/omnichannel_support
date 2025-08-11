import axios from 'axios';
import { API_BASE_URL } from './config';

// 🌐 Tạo axios instance để tái dùng
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// 🔐 Attach token if exists
api.interceptors.request.use((config) => {
  // Token will be added by auth service when available
  return config;
});

// 🧰 Centralized error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // You can log to Sentry or show a toast here
    return Promise.reject(err);
  }
);

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
