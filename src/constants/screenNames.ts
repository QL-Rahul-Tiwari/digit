/**
 * Centralized screen and route names for navigation
 * Use these constants throughout the app to avoid typos and enable easy refactoring
 */

// Root level screens
export const ROOT_SCREENS = {
  SPLASH: 'Splash',
  AUTH: 'Auth',
  MAIN: 'Main',
  STORY_VIEWER: 'StoryViewer',
} as const;

// Unauthenticated user screens
export const UNAUTH_SCREENS = {
  LOGIN: 'Login',
  SIGNUP: 'SignUp',
} as const;

// Authenticated user - Tab screens
export const AUTH_TAB_SCREENS = {
  HOME_TAB: 'HomeTab',
  SEARCH_TAB: 'SearchTab',
  CREATE_TAB: 'CreateTab',
  NOTIFICATIONS_TAB: 'NotificationsTab',
  PROFILE_TAB: 'ProfileTab',
} as const;

// Authenticated user - Profile stack screens
export const AUTH_PROFILE_STACK_SCREENS = {
  PROFILE: 'Profile',
  EDIT_PROFILE: 'EditProfile',
  SETTINGS: 'Settings',
} as const;

/**
 * Navigation group names (for proper typing in stack navigators)
 */
export const NAV_GROUPS = {
  ROOT: 'Root',
  AUTH: 'Auth',
  TAB: 'Tab',
  PROFILE: 'Profile',
} as const;
