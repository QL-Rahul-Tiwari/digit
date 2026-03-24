import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeed } from '../api/feed';
import { FeedPage } from '../types';

export function useFeed() {
  return useInfiniteQuery<FeedPage>({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
