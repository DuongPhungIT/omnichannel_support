import React from 'react';
import { View } from 'react-native';
import { Card, List, Switch, Text, useTheme } from 'react-native-paper';
import { useState } from 'react';

export default function SettingsScreen() {
  const theme = useTheme();
  const [enabled, setEnabled] = useState(true);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
      <Card>
        <Card.Title title="Cài đặt" />
        <Card.Content>
          <List.Item
            title="Bật tính năng X"
            right={() => <Switch value={enabled} onValueChange={setEnabled} />}
          />
          <Text style={{ marginTop: 12 }} variant="bodySmall" >
            Màn hình ví dụ sử dụng component của React Native Paper.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
