import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isOutgoing: boolean;
  status?: MessageStatus;
}

export default function MessageBubble({ text, timestamp, isOutgoing, status }: MessageBubbleProps) {
  const theme = useTheme();

  const backgroundColor = isOutgoing ? '#D9FDD3' : '#FFFFFF';
  const alignItems = isOutgoing ? 'flex-end' : 'flex-start';
  const textColor = '#111827';

  const renderStatusIcon = () => {
    if (!isOutgoing || !status) return null;
    const color = status === 'read' ? theme.colors.primary : '#6B7280';
    const iconName = status === 'sent' ? 'check' : 'check-all';
    return <MaterialCommunityIcons name={iconName as any} size={16} color={color} />;
  };

  return (
    <View style={{ width: '100%', paddingHorizontal: 12, marginVertical: 4, alignItems }}>
      <View
        style={{
          maxWidth: '86%',
          backgroundColor,
          borderRadius: 16,
          paddingHorizontal: 12,
          paddingVertical: 8,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
        }}
      >
        <Text style={{ color: textColor }}>{text}</Text>
        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', marginTop: 4 }}>
          <Text style={{ color: '#6B7280', fontSize: 11, marginRight: 4 }}>{timestamp}</Text>
          {renderStatusIcon()}
        </View>
      </View>
    </View>
  );
}


