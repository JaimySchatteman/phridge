import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { Provider } from '@ant-design/react-native';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './global/navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync(
        'antoutline',
        // eslint-disable-next-line
        require('@ant-design/icons-react-native/fonts/antoutline.ttf'),
      );
    };
    loadFont();
  }, []);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Provider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </Provider>
    </SafeAreaProvider>
  );
}
