import React from 'react';
import { Image, View, TouchableOpacity, Animated } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable, RectButton } from 'react-native-gesture-handler';

export type CallDirection = 'incoming' | 'outgoing' | 'missed';
export type CallKind = 'voice' | 'video';

export interface CallListItemProps {
  displayName: string;
  timeText: string;
  direction: CallDirection;
  kind?: CallKind;
  avatarUrl?: string;
  onPress?: () => void;
}

export default function CallListItem({ displayName, timeText, direction, kind = 'voice', avatarUrl, onPress }: CallListItemProps) {
  const theme = useTheme();

  const subtitleIcon = kind === 'video' ? 'video-outline' : 'phone-outline';
  const directionLabel = direction === 'incoming' ? 'Incoming' : direction === 'outgoing' ? 'Outgoing' : 'Missed';
  const directionColor = direction === 'missed' ? '#DC2626' : '#6B7280';
  const nameColor = direction === 'missed' ? '#DC2626' : '#173558';

  const ACTION_WIDTH = 88;
  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const translate = (offset: number) => progress.interpolate({ inputRange: [0, 1], outputRange: [offset, 0] });
    return (
      <View style={{ flexDirection: 'row', height: '100%' }}>
        <Animated.View style={{ height: '100%', transform: [{ translateX: translate(0) }], opacity: progress }}>
          <RectButton onPress={() => {}} style={{ width: ACTION_WIDTH, height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#DC2626' }}>
            <MaterialCommunityIcons name="delete-outline" size={22} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', marginTop: 4, fontSize: 12, fontWeight: '600' }}>Xóa</Text>
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={(p)=>renderRightActions(p as any)} overshootRight={false} rightThreshold={32} friction={2}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEF2FF' }}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5E7EB' }} />
        ) : (
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#E6F4EA', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: theme.colors.primary, fontWeight: '900' }}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text numberOfLines={1} style={{ fontWeight: '800', color: nameColor, flex: 1, paddingRight: 8 }}>{displayName}</Text>
            <Text style={{ color: '#6B7280', fontSize: 12 }}>{timeText}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <MaterialCommunityIcons name={subtitleIcon as any} color={directionColor} size={16} />
            <Text style={{ color: directionColor, marginLeft: 6 }}>{directionLabel}</Text>
          </View>
        </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}


