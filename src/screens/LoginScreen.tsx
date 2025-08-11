import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Card, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store';
import { loginThunk } from '@/features/auth/authSlice';

type FormValues = { username: string; password: string };

const schema = yup.object({
  username: yup.string().required('Bắt buộc'),
  password: yup.string().required('Bắt buộc'),
});

export default function LoginScreen() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((s: RootState) => s.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = (values: FormValues) => {
    dispatch(loginThunk(values));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <Card
            mode="elevated"
            style={{ width: '100%', maxWidth: 560, borderRadius: 20, shadowOpacity: 0.2 }}
          >
            <Card.Content style={{ paddingVertical: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }} variant="titleLarge">
                K
              </Text>
            </View>
            <Text variant="headlineMedium" style={{ fontWeight: '700' }}>
              Kido CRM Center
            </Text>
          </View>
          <Text style={{ opacity: 0.6, marginBottom: 16 }}>Đăng nhập để tiếp tục</Text>

          <View style={{ gap: 8 }}>
            <Controller
              name="username"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    mode="outlined"
                    label="Tên đăng nhập"
                    autoCapitalize="none"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    outlineStyle={{ borderRadius: 12 }}
                    style={{ backgroundColor: 'white' }}
                  />
                  <HelperText type="error" visible={!!errors.username}>
                    {errors.username?.message}
                  </HelperText>
                </>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    mode="outlined"
                    label="Mật khẩu"
                    secureTextEntry
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    outlineStyle={{ borderRadius: 12 }}
                    style={{ backgroundColor: 'white' }}
                  />
                  <HelperText type="error" visible={!!errors.password}>
                    {errors.password?.message}
                  </HelperText>
                </>
              )}
            />

            {!!auth.errorMessage && (
              <View
                style={{
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: '#fdecea',
                  borderColor: '#f5c2c0',
                  borderWidth: 1,
                  marginTop: 4,
                }}
              >
                <Text style={{ color: '#b42318' }}>{auth.errorMessage}</Text>
              </View>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={auth.loading}
              disabled={auth.loading}
              style={{ marginTop: 8 }}
            >
              Đăng nhập
            </Button>
          </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


