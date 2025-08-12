import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatListScreen from '@/screens/ChatListScreen';
import PersonalScreen from '@/screens/PersonalScreen';
import CallsScreen from '@/screens/CallsScreen';
import ManageScreen from '@/screens/ManageScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type TabParamList = {
  Chat: undefined;
  Calls: undefined;
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
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="chat-processing-outline" size={size} color={color} />
          ),
          title: 'Tin nhắn',
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="Calls"
        component={CallsScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="phone-outline" size={size} color={color} />
          ),
          tabBarLabel: 'Cuộc gọi',
          title: 'Cuộc gọi',
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
