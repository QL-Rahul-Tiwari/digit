import { useQuery } from '@tanstack/react-query';
import { fetchUserPosts } from '../api/posts';
import { Post } from '../types';

export function useUserPosts() {
  return useQuery<Post[], Error>({
    queryKey: ['userPosts'],
    queryFn: () => fetchUserPosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
