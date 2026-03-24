import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { likePost, unlikePost } from '../api/posts';
import { FeedPage, Post } from '../types';

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) =>
      isLiked ? unlikePost(postId) : likePost(postId),
    onMutate: async ({ postId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previous = queryClient.getQueryData<InfiniteData<FeedPage>>(['feed']);

      // Optimistic update
      queryClient.setQueryData<InfiniteData<FeedPage>>(['feed'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post: Post) =>
              post.id === postId
                ? {
                    ...post,
                    isLiked: !isLiked,
                    likesCount: isLiked
                      ? post.likesCount - 1
                      : post.likesCount + 1,
                  }
                : post,
            ),
          })),
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['feed'], context.previous);
      }
    },
  });
}
