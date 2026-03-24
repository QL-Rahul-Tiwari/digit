import axiosInstance from './axiosInstance';
import { AuthResponse, RegisterPayload, LoginPayload, User } from '../types';

/**
 * Normalize a raw user object from the backend into our app's User type.
 * Handles variations in field names (_id vs id, avatar vs profilePhoto, etc.)
 */
function normalizeUser(raw: any): User {
  return {
    id: raw._id ?? raw.id ?? '',
    name: raw.name ?? raw.username ?? '',
    username: raw.username ?? '',
    email: raw.email ?? '',
    profilePhoto: raw.profilePhoto ?? raw.avatar ?? raw.profilePicture ?? '',
    bio: raw.bio ?? '',
    postsCount: raw.postsCount ?? raw.posts?.length ?? 0,
    followersCount: raw.followersCount ?? raw.followers?.length ?? 0,
    followingCount: raw.followingCount ?? raw.following?.length ?? 0,
  };
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await axiosInstance.post('/auth/signup', {
    username: payload.username,
    email: payload.email,
    password: payload.password,
  });

  // Normalize: backend may nest under data.data, data.user, or flat
  const responseData = data?.data ?? data;
  const token = responseData.token ?? responseData.accessToken ?? '';
  const rawUser = responseData.user ?? responseData;

  return {
    token,
    user: normalizeUser(rawUser),
  };
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await axiosInstance.post('/auth/login', {
    email: payload.email,
    password: payload.password,
  });

  // Normalize: backend may nest under data.data, data.user, or flat
  const responseData = data?.data ?? data;
  const token = responseData.token ?? responseData.accessToken ?? '';
  const rawUser = responseData.user ?? responseData;

  return {
    token,
    user: normalizeUser(rawUser),
  };
}
