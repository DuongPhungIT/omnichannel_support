import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/counterSlice';
import authReducer from '@/features/auth/authSlice';
import chatReducer from '@/features/chat/chatSlice';
import conversationsReducer from '@/features/chat/conversationsSlice';

// 🏪 Tạo store trung tâm cho toàn app
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    chat: chatReducer,
    conversations: conversationsReducer,
  },
});

// Kiểu TypeScript tiện dụng cho useDispatch / useSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
