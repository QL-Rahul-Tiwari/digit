import axiosInstance from './axiosInstance';
import { FeedPage, Post, StoryGroup } from '../types';

// Stub data for development
const STUB_USERS = [
  {
    id: 'user-1',
    name: 'Emma Watson',
    username: 'emmawatson',
    email: 'emma@test.com',
    profilePhoto: 'https://i.pravatar.cc/300?u=emma',
    postsCount: 156,
    followersCount: 83200,
    followingCount: 432,
  },
  {
    id: 'user-2',
    name: 'Alex Rivera',
    username: 'alexrivera',
    email: 'alex@test.com',
    profilePhoto: 'https://i.pravatar.cc/300?u=alex',
    postsCount: 89,
    followersCount: 12400,
    followingCount: 678,
  },
  {
    id: 'user-3',
    name: 'Sophia Chen',
    username: 'sophiachen',
    email: 'sophia@test.com',
    profilePhoto: 'https://i.pravatar.cc/300?u=sophia',
    postsCount: 234,
    followersCount: 45600,
    followingCount: 321,
  },
  {
    id: 'user-4',
    name: 'Marcus Johnson',
    username: 'marcusj',
    email: 'marcus@test.com',
    profilePhoto: 'https://i.pravatar.cc/300?u=marcus',
    postsCount: 67,
    followersCount: 8900,
    followingCount: 543,
  },
  {
    id: 'user-5',
    name: 'Lily Park',
    username: 'lilypark',
    email: 'lily@test.com',
    profilePhoto: 'https://i.pravatar.cc/300?u=lily',
    postsCount: 198,
    followersCount: 27300,
    followingCount: 412,
  },
];

const STUB_POSTS: Post[] = [
  {
    id: 'post-1',
    user: STUB_USERS[0],
    mediaType: 'image',
    imageUrl: 'https://picsum.photos/seed/post1/1080/1080',
    caption: 'Golden hour hits different when you\'re in the right place at the right time ✨',
    likesCount: 1243,
    commentsCount: 89,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-2',
    user: STUB_USERS[1],
    mediaType: 'video',
    imageUrl: 'https://picsum.photos/seed/post2thumb/1080/1350',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/post2thumb/1080/1350',
    caption: 'New perspectives, new horizons. Never stop exploring 🌍',
    likesCount: 567,
    commentsCount: 34,
    isLiked: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-3',
    user: STUB_USERS[2],
    mediaType: 'image',
    imageUrl: 'https://picsum.photos/seed/post3/1080/1080',
    caption: 'Minimal vibes only. Less is always more 🤍',
    likesCount: 2341,
    commentsCount: 156,
    isLiked: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-4',
    user: STUB_USERS[3],
    mediaType: 'video',
    imageUrl: 'https://picsum.photos/seed/post4thumb/1080/810',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/post4thumb/1080/810',
    caption: 'Weekend mood 🎵 What\'s everyone listening to?',
    likesCount: 432,
    commentsCount: 67,
    isLiked: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-5',
    user: STUB_USERS[4],
    mediaType: 'image',
    imageUrl: 'https://picsum.photos/seed/post5/1080/1080',
    caption: 'Art is everywhere if you look closely enough 🎨',
    likesCount: 876,
    commentsCount: 45,
    isLiked: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function fetchFeed(page: number, limit: number = 10): Promise<FeedPage> {
  // TODO: Implement actual API call
  // const { data } = await axiosInstance.get<FeedPage>('/api/feed', { params: { page, limit } });
  // return data;

  // Stub: return paginated stub data
  await new Promise<void>((r) => setTimeout(r, 800)); // simulate network delay
  const startIdx = (page - 1) * limit;
  const posts = STUB_POSTS.slice(startIdx, startIdx + limit);
  return {
    posts,
    nextPage: startIdx + limit < STUB_POSTS.length ? page + 1 : null,
    totalPages: Math.ceil(STUB_POSTS.length / limit),
  };
}

export async function fetchStories(): Promise<StoryGroup[]> {
  // TODO: Implement actual API call
  // const { data } = await axiosInstance.get<StoryGroup[]>('/api/stories');
  // return data;

  // Stub data
  await new Promise<void>((r) => setTimeout(r, 500));
  return STUB_USERS.map((user, idx) => ({
    user,
    stories: [
      {
        id: `story-${user.id}-1`,
        user,
        mediaType: idx % 3 === 1 ? 'video' as const : 'image' as const,
        imageUrl: `https://picsum.photos/seed/story${user.id}/1080/1920`,
        videoUrl: idx % 3 === 1
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
          : undefined,
        duration: idx % 3 === 1 ? 15000 : undefined,
        createdAt: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(),
        isViewed: Math.random() > 0.5,
      },
    ],
    hasUnviewed: Math.random() > 0.3,
  }));
}
