import React, { useMemo } from 'react';
import { FlatList, View, Text, Pressable, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

type ManageItem = {
  key: string;
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
};

function useManageItems(navigate: (routeName: string) => void): ManageItem[] {
  return useMemo(
    () => [
      {
        key: 'zaloRoles',
        title: 'Phân quyền Zalo',
        description: 'Quản lý phân quyền kênh Zalo OA',
        icon: 'shield-account',
        onPress: () => navigate('ZaloRoles'),
      },
      {
        key: 'saleRepMapping',
        title: 'Sale Rep cho Telesale',
        description: 'Gán Sale Rep cho tài khoản Telesale',
        icon: 'account-tie',
        onPress: () => navigate('SaleRepMapping'),
      },
      {
        key: 'userAccounts',
        title: 'User Account',
        description: 'Tạo, sửa, phân quyền người dùng',
        icon: 'account-multiple-outline',
        onPress: () => navigate('UserAccounts'),
      },
      {
        key: 'sipAccounts',
        title: 'SIP Account',
        description: 'Cấu hình tài khoản SIP',
        icon: 'phone',
        onPress: () => navigate('SipAccounts'),
      },
      {
        key: 'userSipLink',
        title: 'Liên kết User - SIP',
        description: 'Mapping User Account và SIP Account',
        icon: 'link-variant',
        onPress: () => navigate('UserSipLink'),
      },
    ],
    [navigate]
  );
}

function ScaleCard(props: {
  children: React.ReactNode;
  onPress: () => void;
  backgroundStart: string;
  backgroundEnd: string;
}) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const handleIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  };
  const handleOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  };
  return (
    <Pressable onPress={props.onPress} onPressIn={handleIn} onPressOut={handleOut} style={{ flex: 1 }}>
      <Animated.View
        style={{
          transform: [{ scale }],
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[props.backgroundStart, props.backgroundEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 16 }}
        >
          {props.children}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

export default function ManageScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const primary = theme.colors.primary ?? '#1ebe71';
  const secondary = (theme as any).colors?.secondary ?? '#13A35F';

  const navigate = (routeName: string) => {
    // Hook sẵn cho điều hướng; cập nhật route khi màn hình đích sẵn sàng
  };

  const items = useManageItems(navigate);

  const renderItem = ({ item }: { item: ManageItem }) => (
    <View style={{ flex: 1, marginVertical: 6, marginHorizontal: 8 }}>
      <ScaleCard onPress={item.onPress} backgroundStart={secondary} backgroundEnd={primary}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: 10,
              marginRight: 12,
            }}
          >
            <MaterialCommunityIcons name={item.icon as any} size={24} color="#ffffff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 }}>{item.description}</Text>
          </View>
        </View>
      </ScaleCard>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: '#FFFFFF' }}>
      <FlatList
        contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 4 }}
        data={items}
        numColumns={1}
        keyExtractor={(it) => it.key}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}


