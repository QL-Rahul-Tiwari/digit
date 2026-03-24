import axiosInstance from './axiosInstance';
import { User } from '../types';

/**
 * Normalize raw user from backend to app User type.
 */
function normalizeUser(raw: any): User {
  return {
    id: raw._id ?? raw.id ?? '',
    name: raw.name ?? raw.username ?? '',
    username: raw.username ?? '',
    email: raw.email ?? '',
    profilePhoto: raw.profilePicture ?? raw.profilePhoto ?? raw.avatar ?? '',
    bio: raw.bio ?? '',
    postsCount: raw.postsCount ?? raw.posts?.length ?? 0,
    followersCount: raw.followersCount ?? raw.followers?.length ?? 0,
    followingCount: raw.followingCount ?? raw.following?.length ?? 0,
  };
}

/**
 * Fetch the authenticated user's profile.
 */
export async function fetchMyProfile(): Promise<User> {
  const { data } = await axiosInstance.get('/users/profile');
  const responseData = data?.data ?? data;
  const rawUser = responseData?.user ?? responseData;
  return normalizeUser(rawUser);
}

/**
 * Fetch a user's profile by ID.
 */
export async function fetchUserProfile(userId: string): Promise<User> {
  const { data } = await axiosInstance.get(`/users/${userId}/profile`);
  const responseData = data?.data ?? data;
  const rawUser = responseData?.user ?? responseData;
  return normalizeUser(rawUser);
}

export interface UpdateProfilePayload {
  username?: string;
  bio?: string;
  profilePicture?: string;
}

/**
 * Update the authenticated user's profile.
 */
export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await axiosInstance.put('/users/profile', payload);
  const responseData = data?.data ?? data;
  const rawUser = responseData?.user ?? responseData;
  return normalizeUser(rawUser);
}
