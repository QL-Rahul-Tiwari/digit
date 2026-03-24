import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api/posts';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createPost(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
}
