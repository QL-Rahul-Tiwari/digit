import React from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import OfflineBanner from './src/components/OfflineBanner';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { Colors } from './src/theme';
 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: any) => {
        // Don't retry on network errors beyond 1 attempt
        if (!error.response && failureCount > 1) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'stale', // Refetch stale queries when reconnecting
    },
    mutations: {
      retry: 0, // Don't auto-retry mutations
    },
  },
});
 
function AppContent() {
  const { isOnline } = useNetworkStatus();
 
  return (
    <>
      <OfflineBanner isVisible={!isOnline} />
      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.surface}
          translucent={false}
        />
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}
 
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <AppContent />
        </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}