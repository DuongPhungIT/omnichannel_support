import React from 'react';
import { View } from 'react-native';
import { Card, List, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { logout, logoutThunk } from '@/features/auth/authSlice';

export default function PersonalScreen() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    dispatch(logout());
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
      <Card>
        <Card.Title title="Cá nhân" />
        <Card.Content>
          <List.Section>
            <List.Item
              title="Đổi mật khẩu"
              left={(props) => <List.Icon {...props} icon="lock-reset" />}
              onPress={() => {}}
            />
            <List.Item
              title="Đăng xuất"
              left={(props) => <List.Icon {...props} icon="logout" />}
              onPress={handleLogout}
            />
          </List.Section>
        </Card.Content>
      </Card>
    </View>
  );
}


