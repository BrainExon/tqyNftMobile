import {
  ConnectionProvider,
  RPC_ENDPOINT,
} from './components/providers/ConnectionProvider';
import {AuthorizationProvider} from './components/providers/AuthorizationProvider';
import {clusterApiUrl} from '@solana/web3.js';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Header} from './components/Header';
import MainScreen from './screens/MainScreen';
import ErrorBoundary from 'react-native-error-boundary';
import ErrorOverlay from './components/ui/ErrorOverlay';
export default function App() {
  if (!clusterApiUrl) {
    console.log('[App] error: clusterApiUrl null');
  }
  return (
    <ErrorBoundary FallbackComponent={ErrorOverlay}>
      <ConnectionProvider
        config={{commitment: 'processed'}}
        endpoint={clusterApiUrl(RPC_ENDPOINT)}>
          <SafeAreaView style={styles.shell}>
            <Header />
            <MainScreen />
          </SafeAreaView>
      </ConnectionProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: '100%',
  },
});
