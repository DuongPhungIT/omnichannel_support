import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { login as loginApi, logout as logoutApi } from '@/api/auth';
import { setAuthToken } from '@/api/client';

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  loading: boolean;
  errorMessage: string | null;
  username: string | null;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  loading: false,
  errorMessage: null,
  username: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    payload: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await loginApi(payload);
      if (res.code !== 0 || !res.data) {
        return rejectWithValue(res.message || 'Đăng nhập thất bại');
      }
      return { ...res.data, username: payload.username };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e?.message || 'Đăng nhập thất bại');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenType = null;
      state.username = null;
      state.errorMessage = null;
      setAuthToken(undefined);
    },
    restoreSession(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string | null;
        tokenType: string | null;
        username: string | null;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.tokenType = action.payload.tokenType;
      state.username = action.payload.username;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenType = action.payload.tokenType;
        state.username = action.payload.username;
        setAuthToken(action.payload.accessToken);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = (action.payload as string) || 'Đăng nhập thất bại';
      });
  },
});

export const { logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const state = getState() as { auth: AuthState };
  const token = state.auth.refreshToken;
  try {
    if (token) await logoutApi(token);
  } finally {
    // Always clear client state
    setAuthToken(undefined);
  }
});


