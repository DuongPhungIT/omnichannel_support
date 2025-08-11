import { api } from './client';
import type { ApiResponse } from './config';

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginSuccess = {
  accessToken: string;
  refreshToken: string;
  tokenType: string; // 'Bearer'
};

export async function login(payload: LoginPayload): Promise<ApiResponse<LoginSuccess>> {
  const res = await api.post<ApiResponse<LoginSuccess>>('/auth/login', payload, {
    headers: { 'content-type': 'application/json' },
  });
  return res.data;
}

export async function logout(refreshToken: string) {
  const res = await api.post<ApiResponse<null>>(
    '/auth/logout',
    undefined,
    {
      headers: {
        // Server expects refreshToken in Cookie header
        Cookie: `refreshToken=${refreshToken}`,
      },
    }
  );
  return res.data;
}


