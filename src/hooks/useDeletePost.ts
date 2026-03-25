import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../api/posts';
import { Post } from '../types';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onMutate: async (postId: string) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['userPosts'] });

      // Save previous data
      const previousPosts = queryClient.getQueryData<Post[]>(['userPosts']);

      // Optimistically remove post from cache
      queryClient.setQueryData<Post[]>(['userPosts'], (old) => {
        if (!old) return [];
        return old.filter((post) => post.id !== postId);
      });

      return { previousPosts };
    },
    onError: (error, postId, context: any) => {
      // Restore previous posts on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['userPosts'], context.previousPosts);
      }
    },
    onSuccess: () => {
      // Invalidate feed to sync with server
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
