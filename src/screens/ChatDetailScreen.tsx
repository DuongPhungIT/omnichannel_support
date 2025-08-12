import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, View } from 'react-native';
import { IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import MessageBubble, { MessageStatus } from '@/components/MessageBubble';
import { FlatList } from 'react-native-gesture-handler';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/navigation/StackNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

interface MessageItem {
  id: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
  status?: MessageStatus;
}

const initialMessages: MessageItem[] = [
  { id: 'm1', text: 'Xin chào!', timestamp: '09:10', isOutgoing: false },
  { id: 'm2', text: 'Chào bạn, hôm nay thế nào?', timestamp: '09:11', isOutgoing: true, status: 'delivered' },
  { id: 'm3', text: 'Ổn áp nha 👍', timestamp: '09:12', isOutgoing: false },
];

export default function ChatDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { contactName } = route.params;
  const [messageText, setMessageText] = React.useState('');
  const [messages, setMessages] = React.useState<MessageItem[]>(initialMessages);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: contactName });
  }, [navigation, contactName]);

  const sendMessage = () => {
    const trimmed = messageText.trim();
    if (!trimmed) return;
    const newItem: MessageItem = {
      id: `m${Date.now()}`,
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isOutgoing: true,
      status: 'sent',
    };
    setMessages((prev) => [...prev, newItem]);
    setMessageText('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ECE5DD' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble text={item.text} timestamp={item.timestamp} isOutgoing={item.isOutgoing} status={item.status} />
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            backgroundColor: '#F7F7F7',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
          }}
        >
          <IconButton icon="emoticon-outline" onPress={() => {}} />
          <TextInput
            mode="outlined"
            placeholder="Nhập tin nhắn"
            value={messageText}
            onChangeText={setMessageText}
            style={{ flex: 1, marginRight: 8, backgroundColor: 'white' }}
            outlineStyle={{ borderRadius: 20 }}
          />
          <IconButton icon="send" mode="contained-tonal" onPress={sendMessage} disabled={!messageText.trim()} iconColor={theme.colors.primary} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


