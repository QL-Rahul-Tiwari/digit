import { useQuery } from '@tanstack/react-query';
import { fetchStories } from '../api/feed';

export function useStories() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: fetchStories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
