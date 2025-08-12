import React from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import { Searchbar, Text, ActivityIndicator, useTheme, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import ChatListItem from '@/components/ChatListItem';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/navigation/StackNavigator';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store';
import { fetchConversationsThunk, togglePin } from '@/features/chat/conversationsSlice';

export default function ChatListScreen() {
  const [query, setQuery] = React.useState('');
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const chat = useSelector((s: RootState) => s.chat);
  const conversations = useSelector((s: RootState) => s.conversations);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const nq = stripVN(q);
    const source = conversations.items.map(c => ({
      id: c.id,
      contactName: c.title,
      lastMessagePreview: c.lastPreview || '',
      lastMessageTime: c.lastTimestamp ? new Date(c.lastTimestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
      unreadCount: 0,
      avatarUrl: c.avatarUrl,
      pinned: c.pinned,
    }));
    if (!nq) return source;
    return source.filter((c) =>
      stripVN(c.contactName).toLowerCase().includes(nq) ||
      stripVN(c.lastMessagePreview || '').toLowerCase().includes(nq)
    );
  }, [query, conversations.items]);

  const loadMore = () => {
    if (!conversations.loading && conversations.hasMore) dispatch(fetchConversationsThunk(undefined));
  };

  const onRefresh = () => {
    if (!conversations.refreshing) dispatch(fetchConversationsThunk({ reset: true }));
  };

  React.useEffect(() => {
    dispatch(fetchConversationsThunk({ reset: true }));
  }, [dispatch]);

  React.useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // Build regex to highlight special characters as typed (escape handled by regex constructor with 'g' & 'i')
  const highlightQuery = React.useMemo(() => stripVN(query.trim().toLowerCase()), [query]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ padding: 12 }}>
        <View
          style={{
            height: 44,
            borderRadius: 22,
            backgroundColor: '#F3F6FB',
            paddingHorizontal: 12,
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
          }}
        >
          <TextInput
            mode="flat"
            placeholder="Tìm kiếm"
            value={query}
            onChangeText={setQuery}
            style={{ backgroundColor: 'transparent' }}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            contentStyle={{ height: 40 }}
            right={<TextInput.Icon icon="magnify" color="#9CA3AF" />}
          />
        </View>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => `${item.id}-${index}-${item.pinned ? 'p' : 'n'}`}
        renderItem={({ item }) => (
          <ChatListItem
            contactName={item.contactName}
            lastMessagePreview={item.lastMessagePreview}
            lastMessageTime={item.lastMessageTime}
            unreadCount={item.unreadCount}
            avatarUrl={item.avatarUrl}
            pinned={item.pinned}
            highlightQuery={highlightQuery}
            onPin={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); dispatch(togglePin(item.id)); }}
            onPress={() => navigation.navigate('ChatDetail', { chatId: item.id, contactName: item.contactName })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReachedThreshold={0.25}
        onEndReached={loadMore}
        ListFooterComponent={conversations.loading ? (
          <View style={{ paddingVertical: 12 }}>
            <ActivityIndicator />
          </View>
        ) : null}
        ListEmptyComponent={(() => (
          !conversations.loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ color: '#6B7280' }}>
                {conversations.errorMessage ? `Lỗi: ${conversations.errorMessage}` : 'Chưa có dữ liệu hiển thị'}
              </Text>
            </View>
          ) : null
        ))()}
        refreshControl={<RefreshControl refreshing={conversations.refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}


