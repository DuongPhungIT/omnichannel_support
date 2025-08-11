import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import LoginScreen from '@/screens/LoginScreen';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { Button } from 'react-native-paper';
import { View } from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
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
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{
            title: 'Kido CRM Center',
            headerRight: () => (
              <View style={{ marginRight: 8 }}>
                <Button mode="contained-tonal" compact onPress={() => {}}>
                  Help
                </Button>
              </View>
            ),
          }}
        />
      )}
    </Stack.Navigator>
  );
}
