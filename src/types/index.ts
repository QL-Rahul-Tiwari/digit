export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePhoto: string;
  bio?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export type MediaType = 'image' | 'video';

export interface Post {
  id: string;
  user: User;
  mediaType: MediaType;
  imageUrl: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Story {
  id: string;
  user: User;
  mediaType: MediaType;
  imageUrl: string;
  videoUrl?: string;
  duration?: number; // video duration in ms
  createdAt: string;
  isViewed: boolean;
}

export interface StoryGroup {
  user: User;
  stories: Story[];
  hasUnviewed: boolean;
}

export interface FeedPage {
  posts: Post[];
  nextPage: number | null;
  totalPages: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  profilePhoto?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type AvatarSize = 'sm' | 'md' | 'lg';

export const AVATAR_SIZES: Record<AvatarSize, number> = {
  sm: 32,
  md: 56,
  lg: 96,
};
