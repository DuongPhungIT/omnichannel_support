## Kido CRM Center – Hướng dẫn chạy theo môi trường

### Yêu cầu
- Node.js LTS
- Yarn hoặc npm
- Expo CLI (tùy chọn)

### Cài đặt
```bash
yarn
# hoặc
npm install
```

### Chọn môi trường backend
App sử dụng biến môi trường `EXPO_PUBLIC_ENV` để trỏ domain API:
- `staging`  → `https://sb-kcc.kido.vn`
- `pre`      → `https://pre-kcc.kido.vn`
- `production` (mặc định) → `https://kcc.kido.vn`

### Chạy ứng dụng
```bash
# Staging
EXPO_PUBLIC_ENV=staging yarn start

# Pre-master
EXPO_PUBLIC_ENV=pre yarn start

# Production (mặc định)
EXPO_PUBLIC_ENV=production yarn start
```

Mở bằng Expo Go hoặc chạy nền tảng cụ thể:
```bash
EXPO_PUBLIC_ENV=staging yarn ios
EXPO_PUBLIC_ENV=staging yarn android
```

### API Login
Gọi `POST /api/auth/login` với body JSON `{ username, password }`.
- Thành công: `code === 0`, trả về `data.accessToken`, `refreshToken`, `tokenType`.
- Thất bại: `code !== 0`, có trường `message` để hiển thị lỗi.

### Cấu trúc liên quan
- `src/api/config.ts`: cấu hình domain theo môi trường, `API_BASE_URL`.
- `src/api/client.ts`: axios instance + set token.
- `src/api/auth.ts`: hàm `login`.
- `src/features/auth/authSlice.ts`: Redux slice + `loginThunk`.
- `src/screens/LoginScreen.tsx`: giao diện đăng nhập (Paper UI).
- `src/app/navigation/StackNavigator.tsx`: ép đăng nhập trước khi vào app.


