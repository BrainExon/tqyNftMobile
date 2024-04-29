import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ImageBackground, useColorScheme} from 'react-native';
import {clusterApiUrl} from '@solana/web3.js';
import LoginScreen from './screens/LoginScreen';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import ErrorBoundary from 'react-native-error-boundary';
import ErrorOverlay from './components/ui/ErrorOverlay';
import store from './redux/store';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import {Header} from './components/Header';
import TabsNavigator from './components/ui/TabsNavigator';
const styles = StyleSheet.create({
  shell: {
    height: '100%',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  logo: {
    overflow: 'visible',
    resizeMode: 'cover',
  },
  subtitle: {
    color: '#333',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
  },
});

const Stack = createNativeStackNavigator();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  if (!clusterApiUrl) {
    console.log('[App] error: clusterApiUrl null');
  }
  const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });
  /*
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(255, 45, 85)',
      background: 'transparent',
    },
  };
   */
  const MyTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
      primary: 'rgb(255, 45, 85)',
      background: 'transparent',
    },
  };
  return (
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={ErrorOverlay}>
        <SafeAreaView style={styles.shell}>
          <ImageBackground
            accessibilityRole="image"
            testID="image-background"
            resizeMode="cover"
            source={require('./img/doubloons_bkg.png')}
            style={[
              styles.shell,
              {
                backgroundColor:
                  isDarkMode === 'dark'
                    ? MD3DarkTheme.colors.background
                    : MD3LightTheme.colors.background,
              },
            ]}
            imageStyle={styles.logo}>
            <NavigationContainer theme={MyTheme}>
              <Stack.Navigator>
                <Stack.Screen
                  name="TabsNavigator"
                  component={TabsNavigator}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Login Screen"
                  component={LoginScreen}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </ImageBackground>
        </SafeAreaView>
      </ErrorBoundary>
    </Provider>
  );
}
