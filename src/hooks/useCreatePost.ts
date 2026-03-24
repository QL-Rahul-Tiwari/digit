import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, uploadMedia, CreatePostPayload } from '../api/posts';

interface CreatePostInput {
  fileUri: string;
  mimeType: string;
  fileName: string;
  content: string;
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      // Step 1: Upload media
      const mediaUrl = await uploadMedia(input.fileUri, input.mimeType, input.fileName);

      // Step 2: Create post with returned URL
      return createPost({
        content: input.content,
        mediaUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
