import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/counterSlice';
import authReducer from '@/features/auth/authSlice';

// 🏪 Tạo store trung tâm cho toàn app
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
  },
});

// Kiểu TypeScript tiện dụng cho useDispatch / useSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
