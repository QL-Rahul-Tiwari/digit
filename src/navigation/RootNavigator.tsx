import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROOT_SCREENS } from '../constants/screenNames';
import { useAuthStore } from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import StoryViewerScreen from '../screens/Feed/StoryViewerScreen';
import AddStoryScreen from '../screens/Feed/AddStoryScreen';
import SplashScreen from '../screens/Auth/SplashScreen';

export type RootStackParamList = {
  [ROOT_SCREENS.SPLASH]: undefined;
  [ROOT_SCREENS.AUTH]: undefined;
  [ROOT_SCREENS.MAIN]: undefined;
  [ROOT_SCREENS.STORY_VIEWER]: { initialIndex: number };
  [ROOT_SCREENS.ADD_STORY]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, isLoading, loadPersistedAuth } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    loadPersistedAuth();
  }, [loadPersistedAuth]);

  if (showSplash || isLoading) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name={ROOT_SCREENS.AUTH} component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name={ROOT_SCREENS.MAIN} component={TabNavigator} />
          <Stack.Screen
            name={ROOT_SCREENS.STORY_VIEWER}
            component={StoryViewerScreen}
            options={{
              presentation: 'fullScreenModal',
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name={ROOT_SCREENS.ADD_STORY}
            component={AddStoryScreen}
            options={{
              presentation: 'fullScreenModal',
              animation: 'slide_from_bottom',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
