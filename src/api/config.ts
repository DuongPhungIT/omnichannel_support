// Centralized API environment configuration
// Choose environment via EXPO_PUBLIC_ENV: 'staging' | 'pre' | 'production'

export type ApiEnvironment = 'staging' | 'pre' | 'production';

const ENV: ApiEnvironment = (process.env.EXPO_PUBLIC_ENV as ApiEnvironment) || 'production';

const hostByEnv: Record<ApiEnvironment, string> = {
  staging: 'https://sb-kcc.kido.vn',
  pre: 'https://pre-kcc.kido.vn',
  production: 'https://kcc.kido.vn',
};

export function getApiBaseUrl(): string {
  const host = hostByEnv[ENV];
  return `${host}/api`;
}

export const API_BASE_URL = getApiBaseUrl();

// Useful for debugging / displaying which backend is used
export const API_ENV = ENV;

// Generic API response shape provided by backend
export type ApiResponse<T> = {
  code: number; // 0 on success, otherwise error
  data?: T;
  message?: string;
};


