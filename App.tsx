import 'react-native-gesture-handler';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/app/store';
import { NavigationContainer, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import StackNavigator from '@/app/navigation/StackNavigator';
import { MD3LightTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// 🧩 Trộn theme của Navigation + Paper cho đồng bộ màu sắc
const primaryBlue = '#0A6CFF';
const CombinedTheme = {
  ...NavDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    primary: primaryBlue,
    secondary: '#1367E5',
    background: '#f3f6fb',
  },
} as const;

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={CombinedTheme}>
        <NavigationContainer theme={CombinedTheme}>
          <StackNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
