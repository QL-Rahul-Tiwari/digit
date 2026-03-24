import axiosInstance from './axiosInstance';
import { Post } from '../types';

export async function createPost(formData: FormData): Promise<Post> {
  // TODO: Implement actual API call
  // const { data } = await axiosInstance.post<Post>('/api/posts', formData, {
  //   headers: { 'Content-Type': 'multipart/form-data' },
  // });
  // return data;

  // Stub
  await new Promise<void>((r) => setTimeout(r, 1000));
  return {
    id: 'post-new-' + Date.now(),
    user: {
      id: 'user-1',
      name: 'Demo User',
      username: 'demouser',
      email: 'demo@test.com',
      profilePhoto: 'https://i.pravatar.cc/300?u=demouser',
      postsCount: 43,
      followersCount: 1234,
      followingCount: 567,
    },
    mediaType: 'image',
    imageUrl: 'https://picsum.photos/seed/new/1080/1080',
    caption: '',
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
    createdAt: new Date().toISOString(),
  };
}

export async function likePost(postId: string): Promise<{ likesCount: number; isLiked: boolean }> {
  // TODO: Implement actual API call
  // const { data } = await axiosInstance.post(`/api/posts/${postId}/like`);
  // return data;

  // Stub
  await new Promise<void>((r) => setTimeout(r, 200));
  return { likesCount: Math.floor(Math.random() * 5000), isLiked: true };
}

export async function unlikePost(postId: string): Promise<{ likesCount: number; isLiked: boolean }> {
  // Stub
  await new Promise<void>((r) => setTimeout(r, 200));
  return { likesCount: Math.floor(Math.random() * 5000), isLiked: false };
}
