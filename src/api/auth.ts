import axiosInstance from './axiosInstance';
import { AuthResponse, RegisterPayload, LoginPayload } from '../types';

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  // TODO: Implement actual API call
  // const { data } = await axiosInstance.post<AuthResponse>('/api/auth/register', payload);
  // return data;

  // Stub: simulate successful registration
  return {
    token: 'stub-token-' + Date.now(),
    user: {
      id: 'user-' + Date.now(),
      name: payload.name,
      username: payload.username,
      email: payload.email,
      profilePhoto: '',
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
    },
  };
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  // TODO: Implement actual API call
  // const { data } = await axiosInstance.post<AuthResponse>('/api/auth/login', payload);
  // return data;

  // Stub: simulate successful login
  return {
    token: 'stub-token-' + Date.now(),
    user: {
      id: 'user-1',
      name: 'Demo User',
      username: 'demouser',
      email: payload.email,
      profilePhoto: 'https://i.pravatar.cc/300?u=demouser',
      postsCount: 42,
      followersCount: 1234,
      followingCount: 567,
    },
  };
}
