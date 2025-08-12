import 'react-native-gesture-handler';
import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/app/store';
import { NavigationContainer, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import StackNavigator from '@/app/navigation/StackNavigator';
import { MD3LightTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import BrandSplash from '@/screens/BrandSplash';

// 🧩 Trộn theme của Navigation + Paper cho đồng bộ màu sắc
const primaryBlue = '#1ebe71';
const CombinedTheme = {
  ...NavDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    primary: primaryBlue,
    secondary: '#13A35F',
    background: '#f3f6fb',
  },
} as any;

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [appReady, setAppReady] = React.useState(false);

  React.useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise((res) => setTimeout(res, 600));
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync().catch(() => {});
      }
    };
    prepare();
  }, []);

  if (!appReady) {
    return <BrandSplash />;
  }

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
