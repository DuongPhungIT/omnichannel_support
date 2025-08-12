import React from 'react';
import { Image, View } from 'react-native';
import { Card, List, useTheme, Text, Button, Divider, ActivityIndicator, Chip } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { logout, logoutThunk } from '@/features/auth/authSlice';
import { fetchCurrentUser } from '@/api/user';
import { LinearGradient } from 'expo-linear-gradient';

export default function PersonalScreen() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    dispatch(logout());
  };

  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await fetchCurrentUser();
        setUser(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const HEADER_HEIGHT = 160;
  const AVATAR = 104;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header gradient */}
      <LinearGradient
        colors={[theme.colors.primary, '#6A4CFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ height: HEADER_HEIGHT, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      />

      {/* Floating avatar overlapping banner */}
      <View style={{ position: 'absolute', top: HEADER_HEIGHT - AVATAR / 2, left: 0, right: 0, alignItems: 'center', zIndex: 2 }}>
        <View style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2, overflow: 'hidden', backgroundColor: '#E6F4EA', alignItems: 'center', justifyContent: 'center' }}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={{ width: AVATAR, height: AVATAR }} />
          ) : (
            <Text style={{ color: '#1EBE71', fontWeight: '900', fontSize: 40 }}>K</Text>
          )}
        </View>
      </View>

      {/* Content (no scroll) */}
      <View style={{ flex: 1, padding: 16, paddingTop: HEADER_HEIGHT - AVATAR }}>
        {/* Name and quick actions - placed near avatar */}
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Text variant="titleLarge" style={{ fontWeight: '900', color: '#173558' }}>
            {user?.displayName || user?.username || 'Tài khoản'}
          </Text>
          <Text style={{ color: '#6B7280' }}>{user?.email || user?.phone || ''}</Text>
          <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
            <Chip icon="pencil" onPress={() => {}} style={{ backgroundColor: '#F3F6FB' }} textStyle={{ color: '#173558' }}>Chỉnh sửa</Chip>
            <Chip icon="bell-outline" onPress={() => {}} style={{ backgroundColor: '#F3F6FB' }} textStyle={{ color: '#173558' }}>Thông báo</Chip>
            <Chip icon="shield-check-outline" onPress={() => {}} style={{ backgroundColor: '#F3F6FB' }} textStyle={{ color: '#173558' }}>Bảo mật</Chip>
          </View>
        </View>

        <List.Section>
          <List.Item
            title="Thông tin cá nhân"
            description="Xem và cập nhật thông tin"
            left={(props) => <List.Icon {...props} icon="account-outline" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Đổi mật khẩu"
            description="Bảo vệ tài khoản của bạn"
            left={(props) => <List.Icon {...props} icon="lock-reset" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Thiết lập thông báo"
            description="Bật/tắt thông báo hệ thống"
            left={(props) => <List.Icon {...props} icon="bell-outline" />}
            onPress={() => {}}
          />
        </List.Section>
        <View style={{ height: 72 }} />
      </View>

      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 24 }}>
        <Button mode="contained" icon="logout" onPress={handleLogout} style={{ borderRadius: 12, backgroundColor: '#1EBE71' }}>
          Đăng xuất
        </Button>
      </View>

      {loading ? (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : null}
    </View>
  );
}


