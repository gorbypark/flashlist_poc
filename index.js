/**
 * @format
 */

import React from 'react';
import {AppRegistry, useColorScheme, PlatformColor} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

const ModifiedDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: PlatformColor('secondarySystemBackground'),
  },
};

const Entry = () => {
  const scheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={scheme === 'dark' ? DarkTheme : ModifiedDefaultTheme}>
        <App />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

AppRegistry.registerComponent(appName, () => Entry);
