import axiosInstance from './axiosInstance';
import { Post } from '../types';

/**
 * Upload a media file (image or video) to the server.
 * Returns the uploaded media URL.
 */
export async function uploadMedia(fileUri: string, mimeType: string, fileName: string): Promise<string> {
  const formData = new FormData();
  formData.append('media', {
    uri: fileUri,
    type: mimeType,
    name: fileName,
  } as any);

  const { data } = await axiosInstance.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // 60s for large files
  });

  // Backend may return URL in various shapes
  const responseData = data?.data ?? data;
  const url: string =
    responseData?.mediaUrl ??
    responseData?.url ??
    responseData?.fileUrl ??
    responseData?.path ??
    '';

  if (!url) {
    throw new Error('Upload succeeded but no media URL returned');
  }

  return url;
}

export interface CreatePostPayload {
  content: string;
  mediaUrl: string;
}

/**
 * Create a new post with content and media URL.
 */
export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const { data } = await axiosInstance.post('/posts', {
    content: payload.content,
    mediaUrl: payload.mediaUrl,
  });

  const responseData = data?.data ?? data;
  const raw = responseData?.post ?? responseData;
  const user = raw?.user ?? {};

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
    mediaType: raw.mediaType ?? 'image',
    imageUrl: raw.mediaUrl ?? raw.imageUrl ?? '',
    videoUrl: raw.videoUrl ?? undefined,
    thumbnailUrl: raw.thumbnailUrl ?? undefined,
    caption: raw.content ?? raw.caption ?? '',
    likesCount: raw.likesCount ?? 0,
    commentsCount: raw.commentsCount ?? 0,
    isLiked: raw.isLiked ?? false,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

/**
 * Fetch authenticated user's own posts from GET /posts/me
 */
export async function fetchUserPosts(): Promise<Post[]> {
  const { data } = await axiosInstance.get('/posts/me');
  const responseData = data?.data ?? data;
  const posts = Array.isArray(responseData) ? responseData : responseData?.posts ?? [];

  return posts.map((raw: any) => {
    const user = raw?.user ?? {};
    const mediaUrl = raw?.mediaUrl ?? '';
    const isVideo = mediaUrl.toLowerCase().includes('.mp4') || 
                    mediaUrl.toLowerCase().includes('.mov') || 
                    mediaUrl.toLowerCase().includes('.m4v');

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
      mediaType: isVideo ? 'video' : 'image',
      imageUrl: isVideo ? (raw.thumbnailUrl ?? '') : (mediaUrl ?? ''),
      videoUrl: isVideo ? mediaUrl : undefined,
      thumbnailUrl: raw.thumbnailUrl ?? undefined,
      caption: raw.content ?? raw.caption ?? '',
      likesCount: raw.likesCount ?? 0,
      commentsCount: raw.commentsCount ?? 0,
      isLiked: raw.isLiked ?? false,
      createdAt: raw.createdAt ?? new Date().toISOString(),
    };
  });
}

export async function likePost(postId: string): Promise<{ likesCount: number; isLiked: boolean }> {
  // TODO: Wire to real endpoint when available
  // const { data } = await axiosInstance.post(`/posts/${postId}/like`);
  // return data;
  await new Promise<void>((r) => setTimeout(r, 200));
  return { likesCount: Math.floor(Math.random() * 5000), isLiked: true };
}

export async function unlikePost(postId: string): Promise<{ likesCount: number; isLiked: boolean }> {
  // TODO: Wire to real endpoint when available
  // const { data } = await axiosInstance.delete(`/posts/${postId}/like`);
  // return data;
  await new Promise<void>((r) => setTimeout(r, 200));
  return { likesCount: Math.floor(Math.random() * 5000), isLiked: false };
}

/**
 * Delete a post by ID - DELETE /posts/{postId}
 */
export async function deletePost(postId: string): Promise<void> {
  await axiosInstance.delete(`/posts/${postId}`);
}
