import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const AUTH_TOKEN_KEY = '@digit_auth_token';
const AUTH_USER_KEY = '@digit_auth_user';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadPersistedAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (token: string, user: User) => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  clearAuth: async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(AUTH_USER_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadPersistedAuth: async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userJson = await AsyncStorage.getItem(AUTH_USER_KEY);
      if (token && userJson) {
        const user: User = JSON.parse(userJson);
        set({ token, user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
