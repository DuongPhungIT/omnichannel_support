import React from 'react';
import { View } from 'react-native';
import { Button, Card, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '@/api/client';

type FormValues = {
  email: string;
  password: string;
};

// ✅ Yup schema cho validation
const schema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Bắt buộc'),
  password: yup.string().min(6, 'Tối thiểu 6 ký tự').required('Bắt buộc'),
});

export default function FormScreen() {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: yupResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (values: FormValues) => {
    try {
      // Ví dụ gọi API với axios client
      // const res = await api.post('/login', values);
      // console.log(res.data);
      await new Promise((r) => setTimeout(r, 600)); // giả lập
      reset();
      alert('Đăng nhập thành công (demo)');
    } catch (e: any) {
      alert('Có lỗi xảy ra: ' + (e?.message ?? 'Unknown'));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
      <Card>
        <Card.Title title="Form ví dụ (React Hook Form + Yup)" />
        <Card.Content style={{ gap: 12 }}>
          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email?.message}
                </HelperText>
              </>
            )}
          />
          {/* Password */}
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Mật khẩu"
                  secureTextEntry
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password?.message}
                </HelperText>
              </>
            )}
          />
          <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting} disabled={isSubmitting}>
            Gửi
          </Button>
          <Text variant="bodySmall" style={{ opacity: 0.7 }}>
            *Dữ liệu gửi thật hãy cấu hình baseURL trong src/api/client.ts
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
