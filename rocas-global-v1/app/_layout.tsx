import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import React from 'react';
import useAppStore from '@/store/store';
import Onboarding from '@/components/Onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Web3AuthProvider } from '@/context/Web3AuthContext';


// Your root component
export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { isFirstLaunch, setFirstLaunch } = useAppStore();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setFirstLaunch(true);
      } else {
        setFirstLaunch(false);
      }
    });
  }, [setFirstLaunch]);

  if (!loaded || isFirstLaunch === undefined) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { theme, setTheme, isFirstLaunch, setFirstLaunch } = useAppStore();

  useEffect(() => {
    setTheme(colorScheme as 'light' | 'dark');
  }, [colorScheme, setTheme]);

  if (isFirstLaunch) {
    return <Onboarding onDone={() => setFirstLaunch(false)} />;
  }

  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Web3AuthProvider>

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
      </Web3AuthProvider>

    </ThemeProvider>

  );
}
