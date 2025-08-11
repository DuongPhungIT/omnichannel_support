import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/HomeScreen';
import PersonalScreen from '@/screens/PersonalScreen';
import ManageScreen from '@/screens/ManageScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type TabParamList = {
  Chat: undefined;
  Manage: undefined;
  Personal: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12 },
      }}
      initialRouteName="Chat"
    >
      <Tab.Screen
        name="Chat"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="chat-processing-outline" size={size} color={color} />
          ),
          title: 'Tin nhắn',
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="Manage"
        component={ManageScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="view-grid-outline" size={size} color={color} />
          ),
          tabBarLabel: 'Quản lý',
          title: 'Quản lý',
        }}
      />
      <Tab.Screen
        name="Personal"
        component={PersonalScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
          ),
          tabBarLabel: 'Cá nhân',
          title: 'Cá nhân',
        }}
      />
    </Tab.Navigator>
  );
}
