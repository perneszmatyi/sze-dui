import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="groups/[id]" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="participants/[id]" 
        options={{ 
            headerShown: false
        }} 
      />
      <Stack.Screen 
        name="tests/[participantId]" 
        options={{ 
            headerShown: false
        }} 
      />
    </Stack>
    
  );
}
