import axiosInstance from './axiosInstance';
import { User } from '../types';

export async function fetchUserProfile(userId: string): Promise<User> {
  // TODO: Implement actual API call
  // const { data } = await axiosInstance.get<User>(`/api/users/${userId}/profile`);
  // return data;

  // Stub
  await new Promise((r) => setTimeout(r, 500));
  return {
    id: userId,
    name: 'Demo User',
    username: 'demouser',
    email: 'demo@test.com',
    profilePhoto: 'https://i.pravatar.cc/300?u=' + userId,
    bio: 'Digital creator • Photography enthusiast • Living in the moment',
    postsCount: 42,
    followersCount: 1234,
    followingCount: 567,
  };
}
