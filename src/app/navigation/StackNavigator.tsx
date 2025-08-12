import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import LoginScreen from '@/screens/LoginScreen';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import ChatDetailScreen from '@/screens/ChatDetailScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { View, Text } from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  ChatDetail: { chatId: string; contactName: string };
  // Có thể thêm màn khác: Details: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const isAuthenticated = useSelector((s: RootState) => !!s.auth.accessToken);
  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Đăng nhập', headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={({ route }) => {
              const base = 'Kido CRM Center';
              const focused = getFocusedRouteNameFromRoute(route) ?? 'Chat';
              const suffixMap: Record<string, string> = {
                Chat: 'Chat',
                Manage: 'Quản lý',
                Personal: 'Cá nhân',
              };
              const title = `${base} - ${suffixMap[focused] ?? focused}`;
              const Header = () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: '600', color: '#173558' }}>{title}</Text>
                </View>
              );
              return {
                headerTitle: () => <Header />,
                headerTitleAlign: 'center' as const,
              };
            }}
          />
          <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ title: 'Chi tiết chat' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
