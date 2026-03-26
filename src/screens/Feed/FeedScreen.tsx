import React, { useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../theme';
import {
  ROOT_SCREENS,
  AUTH_TAB_SCREENS,
  AUTH_PROFILE_STACK_SCREENS,
} from '../../constants/screenNames';
import { useFeed } from '../../hooks/useFeed';
import { useStories } from '../../hooks/useStories';
import { useLikePost } from '../../hooks/useLikePost';
import { useSocket } from '../../hooks/useSocket';
import PostCard from '../../components/PostCard';
import StoriesRow from '../../components/StoriesRow';
import SkeletonLoader from '../../components/SkeletonLoader';
import { Post } from '../../types';

export default function FeedScreen() {
  const navigation = useNavigation<any>();
  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useFeed();
  const { data: stories } = useStories();
  const likeMutation = useLikePost();

  // Wire up socket for real-time
  useSocket();

  const posts = useMemo(
    () => data?.pages.flatMap((page: any) => page.posts) ?? [],
    [data],
  );
  console.log('FeedScreen rendered with posts:', posts);

  const handleLike = useCallback(
    (postId: string, isLiked: boolean) => {
      likeMutation.mutate({ postId, isLiked });
    },
    [likeMutation],
  );

  const handleStoryPress = useCallback(
    (index: number) => {
      navigation.navigate(ROOT_SCREENS.STORY_VIEWER, { initialIndex: index });
    },
    [navigation],
  );

  const handleAddStory = useCallback(() => {
    navigation.navigate(ROOT_SCREENS.ADD_STORY);
  }, [navigation]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const renderHeader = useCallback(() => {
    return (
      <View>
        {/* App header */}
        <View style={styles.appHeader}>
          <Text style={styles.appTitle}>Digit</Text>
        </View>
        {/* Stories Row with Add Story */}
        <StoriesRow
          stories={stories ?? []}
          onStoryPress={handleStoryPress}
          onAddStory={handleAddStory}
        />
      </View>
    );
  }, [stories, handleStoryPress, handleAddStory]);

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        onLike={handleLike}
        onProfilePress={(userId) =>
          navigation.navigate(AUTH_TAB_SCREENS.PROFILE_TAB, { screen: AUTH_PROFILE_STACK_SCREENS.PROFILE, params: { userId } })
        }
      />
    ),
    [handleLike, navigation],
  );

  const renderLoadingFooter = useCallback(() => {
    if (!isFetchingNextPage || posts.length === 0) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color={Colors.primary_container} />
        <Text style={styles.loadingText}>Loading more posts...</Text>
      </View>
    );
  }, [isFetchingNextPage, posts.length]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <SkeletonLoader count={3} />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderPost}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderLoadingFooter}
      style={styles.container}
      contentContainerStyle={styles.listContent}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={Colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  listContent: {
    paddingBottom: Spacing.spacing_8,
  },
  appHeader: {
    paddingHorizontal: Spacing.spacing_4,
    paddingVertical: Spacing.spacing_3,
    backgroundColor: Colors.surface,
  },
  appTitle: {
    ...Typography.Headline_SM,
    color: Colors.on_surface,
  },
  loadingFooter: {
    paddingBottom: Spacing.spacing_2,
    paddingHorizontal: Spacing.spacing_4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.Body_MD,
    color: Colors.on_surface_variant,
    marginTop: Spacing.spacing_2,
  },
});
