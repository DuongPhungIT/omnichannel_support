import React from 'react';
import { View } from 'react-native';
import { Card, List, useTheme } from 'react-native-paper';

export default function ManageScreen() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
      <Card>
        <Card.Title title="Quản lý" />
        <Card.Content>
          <List.Section>
            <List.Item title="Quản lý phân quyền Zalo" left={(p) => <List.Icon {...p} icon="shield-account" />} />
            <List.Item title="Quản lý phân quyền Sale Rep cho Telesale Account" left={(p) => <List.Icon {...p} icon="account-tie" />} />
            <List.Item title="Quản lý User Account" left={(p) => <List.Icon {...p} icon="account-multiple-outline" />} />
            <List.Item title="Quản lý SIP Account" left={(p) => <List.Icon {...p} icon="phone" />} />
            <List.Item title="Quản lý mapping User Account và Sip Account" left={(p) => <List.Icon {...p} icon="link-variant" />} />
          </List.Section>
        </Card.Content>
      </Card>
    </View>
  );
}


