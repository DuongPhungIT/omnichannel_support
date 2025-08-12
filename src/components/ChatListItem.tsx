import React from "react";
import { Image, TouchableOpacity, View, Animated } from "react-native";
import { Text, Badge, useTheme } from "react-native-paper";
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface ChatListItemProps {
  contactName: string;
  lastMessagePreview: string;
  lastMessageTime: string;
  unreadCount?: number;
  avatarUrl?: string;
  onPress?: () => void;
  highlightQuery?: string | null;
  onMarkUnread?: () => void;
  onPin?: () => void;
  onMore?: () => void;
  pinned?: boolean;
}

export default function ChatListItem({
  contactName,
  lastMessagePreview,
  lastMessageTime,
  unreadCount = 0,
  avatarUrl,
  onPress,
  highlightQuery,
  onMarkUnread,
  onPin,
  onMore,
  pinned,
}: ChatListItemProps) {
  const theme = useTheme();

  const stripVN = (input: string) =>
    (input || '')
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
      .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
      .replace(/[ÌÍỊỈĨ]/g, 'I')
      .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
      .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
      .replace(/[ỲÝỴỶỸ]/g, 'Y')
      .replace(/Đ/g, 'D');

  const renderHighlighted = (text: string) => {
    if (!highlightQuery || !text) {
      return (
        <Text numberOfLines={1} style={{ color: "#4B5563", flex: 1, paddingRight: 8 }}>
          {text}
        </Text>
      );
    }
    const norm = stripVN(text);
    const q = highlightQuery;
    const idx = norm.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) {
      return (
        <Text numberOfLines={1} style={{ color: "#4B5563", flex: 1, paddingRight: 8 }}>
          {text}
        </Text>
      );
    }
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + q.length);
    const after = text.slice(idx + q.length);
    const nodes: React.ReactNode[] = [];
    if (before) nodes.push(<Text key="b" style={{ color: '#4B5563' }}>{before}</Text>);
    nodes.push(<Text key="m" style={{ backgroundColor: 'rgba(255, 235, 59, 0.35)', color: '#111827', fontWeight: '700' }}>{match}</Text>);
    if (after) nodes.push(<Text key="a" style={{ color: '#4B5563' }}>{after}</Text>);
    return (
      <Text numberOfLines={1} style={{ flex: 1, paddingRight: 8 }}>
        {nodes}
      </Text>
    );
  };

  const ACTION_WIDTH = 88;

  const ActionButton = ({ icon, label, bg, onPress: onActionPress }: { icon: any; label: string; bg: string; onPress?: () => void }) => (
    <RectButton onPress={onActionPress} style={{ width: ACTION_WIDTH, height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: bg }}>
      <MaterialCommunityIcons name={icon} size={22} color={'#FFFFFF'} />
      <Text style={{ color: '#FFFFFF', marginTop: 4, fontSize: 12, fontWeight: '600' }}>{label}</Text>
    </RectButton>
  );

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const translate = (offset: number) => progress.interpolate({ inputRange: [0, 1], outputRange: [offset, 0] });
    const Opacity = progress; // simple fade-in
    return (
      <View style={{ flexDirection: 'row', height: '100%' }}>
        <Animated.View style={{ height: '100%', transform: [{ translateX: translate(ACTION_WIDTH * 2) }], opacity: Opacity }}>
          <ActionButton icon="eye-off-outline" label="Unread" bg="#10B981" onPress={onMarkUnread} />
        </Animated.View>
        <Animated.View style={{ height: '100%', transform: [{ translateX: translate(ACTION_WIDTH) }], opacity: Opacity }}>
          <ActionButton icon="pin-outline" label="Pin" bg="#059669" onPress={onPin} />
        </Animated.View>
        <Animated.View style={{ height: '100%', transform: [{ translateX: translate(0) }], opacity: Opacity }}>
          <ActionButton icon="dots-horizontal" label="More" bg="#047857" onPress={onMore} />
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={(progress /*, dragX*/) => renderRightActions(progress as any)}
      overshootRight={false}
      rightThreshold={32}
      friction={2}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{ paddingHorizontal: 12 }}
      >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#EEF2FF",
        }}
      >
        <View>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#E5E7EB",
              }}
            />
          ) : (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#D9FDD3",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#A7F3D0",
              }}
            >
              <Text style={{ color: "#173558", fontWeight: "800" }}>
                {contactName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {pinned ? (
            <View style={{ position: 'absolute', right: -4, top: -4, backgroundColor: '#059669', borderRadius: 10, paddingHorizontal: 4, paddingVertical: 2 }}>
              <MaterialCommunityIcons name="pin" size={14} color="#FFFFFF" />
            </View>
          ) : null}
        </View>
        <View style={{ flex: 1, marginLeft: 12, paddingBottom: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Text style={{ fontWeight: "800", color: "#173558" }}>
              {contactName}
            </Text>
            <Text style={{ color: "#6B7280", fontSize: 12 }}>
              {lastMessageTime}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {renderHighlighted(lastMessagePreview)}
            {unreadCount > 0 ? (
              <Badge style={{ backgroundColor: theme.colors.primary }}>
                {unreadCount}
              </Badge>
            ) : null}
          </View>
        </View>
      </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
