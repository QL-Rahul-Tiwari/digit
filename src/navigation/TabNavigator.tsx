import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  AUTH_TAB_SCREENS,
  AUTH_PROFILE_STACK_SCREENS,
} from '../constants/screenNames';
import { Colors } from '../theme';
import TabBarIcon from '../components/TabBarIcon';

import FeedScreen from '../screens/Feed/FeedScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import CreatePostScreen from '../screens/CreatePost/CreatePostScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';

export type TabParamList = {
  [AUTH_TAB_SCREENS.HOME_TAB]: undefined;
  [AUTH_TAB_SCREENS.SEARCH_TAB]: undefined;
  [AUTH_TAB_SCREENS.CREATE_TAB]: undefined;
  [AUTH_TAB_SCREENS.NOTIFICATIONS_TAB]: undefined;
  [AUTH_TAB_SCREENS.PROFILE_TAB]: undefined;
};

// Profile stack for nested navigation
const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name={AUTH_PROFILE_STACK_SCREENS.PROFILE} component={ProfileScreen} />
      <ProfileStack.Screen name={AUTH_PROFILE_STACK_SCREENS.EDIT_PROFILE} component={EditProfileScreen} />
      <ProfileStack.Screen name={AUTH_PROFILE_STACK_SCREENS.SETTINGS} component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.on_surface_variant,
      }}>
      <Tab.Screen
        name={AUTH_TAB_SCREENS.HOME_TAB}
        component={FeedScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabBarIcon
              family="Ionicons"
              name={focused ? 'home' : 'home-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name={AUTH_TAB_SCREENS.SEARCH_TAB}
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabBarIcon family="Feather" name="search" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={AUTH_TAB_SCREENS.CREATE_TAB}
        component={CreatePostScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabBarIcon
              family="Ionicons"
              name={focused ? 'add-circle' : 'add-circle-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name={AUTH_TAB_SCREENS.NOTIFICATIONS_TAB}
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabBarIcon
              family="Ionicons"
              name={focused ? 'heart' : 'heart-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name={AUTH_TAB_SCREENS.PROFILE_TAB}
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabBarIcon
              family="Ionicons"
              name={focused ? 'person' : 'person-outline'}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    // backgroundColor: Colors.surface_glass,
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderTopColor: Colors.ghost_border_10,
    // elevation: 0,
    // position: 'absolute',
    ...Platform.select({
      ios: {
        // Glassmorphism approximation — the actual blur is best on real device
        // For full blur, use a custom tabBar with BlurView
      },
    }),
  },
});
