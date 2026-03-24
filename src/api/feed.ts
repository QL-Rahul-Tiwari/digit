import axiosInstance from './axiosInstance';
import { FeedPage, Post, StoryGroup } from '../types';

/**
 * Detect media type from URL by checking extension and common video patterns.
 */
function detectMediaType(url: string): 'image' | 'video' {
  if (!url) return 'image';
  const lower = url.toLowerCase();
  const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m3u8'];
  if (videoExts.some((ext) => lower.includes(ext))) return 'video';
  return 'image';
}

/**
 * Normalize a raw post from the backend into the app's Post type.
 * Handles field name differences and provides safe defaults.
 */
function normalizePost(raw: any): Post {
  const mediaUrl: string = raw.mediaUrl ?? raw.imageUrl ?? '';
  const mediaType = raw.mediaType ?? detectMediaType(mediaUrl);

  const user = raw.user ?? {};
  return {
    id: raw.id ?? raw._id ?? '',
    user: {
      id: user.id ?? user._id ?? '',
      name: user.name ?? user.username ?? '',
      username: user.username ?? '',
      email: user.email ?? '',
      profilePhoto: user.profilePicture ?? user.profilePhoto ?? user.avatar ?? '',
      bio: user.bio ?? '',
      postsCount: user.postsCount ?? 0,
      followersCount: user.followersCount ?? 0,
      followingCount: user.followingCount ?? 0,
    },
    mediaType,
    imageUrl: mediaType === 'video' ? (raw.thumbnailUrl ?? mediaUrl) : mediaUrl,
    videoUrl: mediaType === 'video' ? mediaUrl : undefined,
    thumbnailUrl: raw.thumbnailUrl ?? undefined,
    caption: raw.content ?? raw.caption ?? '',
    likesCount: raw.likesCount ?? raw.likes?.length ?? 0,
    commentsCount: raw.commentsCount ?? raw.comments?.length ?? 0,
    isLiked: raw.isLiked ?? false,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export async function fetchFeed(page: number, limit: number = 10): Promise<FeedPage> {
  const { data } = await axiosInstance.get('/posts/feed', {
    params: { page, limit },
  });

  // Backend wraps in { status, code, message, data: { posts, total, page, totalPages } }
  const responseData = data?.data ?? data;
  const rawPosts: any[] = responseData?.posts ?? [];
  const currentPage: number = responseData?.page ?? page;
  const totalPages: number = responseData?.totalPages ?? 1;

  return {
    posts: rawPosts.map(normalizePost),
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    totalPages,
  };
}

// ─── Stories ──────────────────────────────────────────────────

/**
 * Normalize a raw story from backend into the app's Story type.
 */
function normalizeStory(raw: any): import('../types').Story {
  const mediaUrl: string = raw.mediaUrl ?? raw.imageUrl ?? '';
  const mediaType = raw.mediaType ?? detectMediaType(mediaUrl);
  const user = raw.user ?? {};

  return {
    id: raw.id ?? raw._id ?? '',
    user: {
      id: user.id ?? user._id ?? '',
      name: user.name ?? user.username ?? '',
      username: user.username ?? '',
      email: user.email ?? '',
      profilePhoto: user.profilePicture ?? user.profilePhoto ?? user.avatar ?? '',
      bio: user.bio ?? '',
      postsCount: user.postsCount ?? 0,
      followersCount: user.followersCount ?? 0,
      followingCount: user.followingCount ?? 0,
    },
    mediaType,
    imageUrl: mediaType === 'video' ? (raw.thumbnailUrl ?? mediaUrl) : mediaUrl,
    videoUrl: mediaType === 'video' ? mediaUrl : undefined,
    duration: raw.duration ?? undefined,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    isViewed: raw.isViewed ?? false,
  };
}

/**
 * Group flat stories array by user into StoryGroup[].
 */
function groupStoriesByUser(stories: import('../types').Story[]): StoryGroup[] {
  const map = new Map<string, StoryGroup>();

  for (const story of stories) {
    const userId = story.user.id;
    if (!map.has(userId)) {
      map.set(userId, {
        user: story.user,
        stories: [],
        hasUnviewed: false,
      });
    }
    const group = map.get(userId)!;
    group.stories.push(story);
    if (!story.isViewed) {
      group.hasUnviewed = true;
    }
  }

  return Array.from(map.values());
}

export async function fetchStories(): Promise<StoryGroup[]> {
  const { data } = await axiosInstance.get('/stories/active');

  const responseData = data?.data ?? data;
  const rawStories: any[] = Array.isArray(responseData)
    ? responseData
    : responseData?.stories ?? [];

  const stories = rawStories.map(normalizeStory);
  return groupStoriesByUser(stories);
}

export interface CreateStoryPayload {
  content: string;
  mediaUrl: string;
}

export async function createStory(payload: CreateStoryPayload): Promise<void> {
  await axiosInstance.post('/stories', {
    content: payload.content,
    mediaUrl: payload.mediaUrl,
  });
}
