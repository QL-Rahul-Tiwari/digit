import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UNAUTH_SCREENS } from '../constants/screenNames';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';

export type AuthStackParamList = {
  [UNAUTH_SCREENS.LOGIN]: undefined;
  [UNAUTH_SCREENS.SIGNUP]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={UNAUTH_SCREENS.LOGIN}>
        {(props: any) => (
          <LoginScreen
            {...props}
            onNavigateSignUp={() => props.navigation.navigate(UNAUTH_SCREENS.SIGNUP)}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={UNAUTH_SCREENS.SIGNUP}>
        {(props: any) => (
          <SignUpScreen
            {...props}
            onNavigateLogin={() => props.navigation.navigate(UNAUTH_SCREENS.LOGIN)}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
