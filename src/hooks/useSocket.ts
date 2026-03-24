import { useEffect } from 'react';
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { useSocketStore } from '../store/socketStore';
import { useAuthStore } from '../store/authStore';
import { FeedPage, Post } from '../types';

export function useSocket() {
  const queryClient = useQueryClient();
  const { connect, disconnect, socket } = useSocketStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

  useEffect(() => {
    if (!socket) return;

    const handleNewPost = (newPost: Post) => {
      queryClient.setQueryData<InfiniteData<FeedPage>>(['feed'], (old) => {
        if (!old) return old;
        const firstPage = old.pages[0];
        return {
          ...old,
          pages: [
            { ...firstPage, posts: [newPost, ...firstPage.posts] },
            ...old.pages.slice(1),
          ],
        };
      });
    };

    const handleNewStory = () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    };

    socket.on('new_post', handleNewPost);
    socket.on('new_story', handleNewStory);

    return () => {
      socket.off('new_post', handleNewPost);
      socket.off('new_story', handleNewStory);
    };
  }, [socket, queryClient]);
}
