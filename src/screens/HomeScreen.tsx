import React from 'react';
import { View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { increment, decrement, addBy } from '@/features/counter/counterSlice';
import { Button, Card, Text, useTheme } from 'react-native-paper';

export default function HomeScreen() {
  const theme = useTheme();
  const value = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
      <Card mode="elevated">
        <Card.Title title="Counter (Redux Toolkit)" />
        <Card.Content>
          <Text variant="displaySmall" style={{ marginBottom: 12 }}>{value}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button mode="contained" onPress={() => dispatch(increment())}>+1</Button>
            <Button mode="contained-tonal" onPress={() => dispatch(decrement())}>-1</Button>
            <Button mode="outlined" onPress={() => dispatch(addBy(5))}>+5</Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}
