import { api } from '@/api/client';

export interface CurrentUserResponse {
  id: string | number;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
}

export async function fetchCurrentUser() {
  const res = await api.get('/auth/current-user');
  return res.data?.data ?? res.data;
}


