import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../theme';
import { AUTH_PROFILE_STACK_SCREENS } from '../../constants/screenNames';
import { useAuthStore } from '../../store/authStore';
import { fetchMyProfile } from '../../api/users';
import { useUserPosts } from '../../hooks/useUserPosts';
import { useDeletePost } from '../../hooks/useDeletePost';
import Avatar from '../../components/Avatar';
import { formatCount } from '../../utils/formatDate';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 1;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - Spacing.spacing_4 - GRID_GAP * 2) / 3;

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: userPosts = [], isLoading: isLoadingPosts, refetch: refetchPosts } = useUserPosts();
  const { mutate: deletePostMutation } = useDeletePost();

  // Refresh profile from server whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          setIsRefreshing(true);
          const freshUser = await fetchMyProfile();
          if (!cancelled && token) {
            await setAuth(token, freshUser);
          }
          await refetchPosts();
        } catch {
          // Silently fail — show cached user
        } finally {
          if (!cancelled) setIsRefreshing(false);
        }
      })();
      return () => { cancelled = true; };
    }, [token, setAuth, refetchPosts]),
  );

  const handleDeletePost = (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            deletePostMutation(postId, {
              onError: (error: any) => {
                const msg = error?.response?.data?.message ?? 'Failed to delete post';
                Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg));
              },
            });
          },
          style: 'destructive',
        },
      ],
    );
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with settings */}
      <View style={styles.header}>
        <Text style={styles.headerUsername}>{user.username}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(AUTH_PROFILE_STACK_SCREENS.SETTINGS)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="settings" size={22} color={Colors.on_surface} />
        </TouchableOpacity>
      </View>

      {/* Profile info */}
      <View style={styles.profileSection}>
        <Avatar
          uri={user.profilePhoto || 'https://i.pravatar.cc/300?u=default'}
          size="lg"
          showStoryRing
          hasUnviewedStory={false}
        />
        <Text style={styles.displayName}>{user.name}</Text>
        <Text style={styles.usernameLabel}>@{user.username}</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>{formatCount(user.postsCount)}</Text>
          <Text style={styles.statLabel}>POSTS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>
            {formatCount(user.followersCount)}
          </Text>
          <Text style={styles.statLabel}>FOLLOWERS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>
            {formatCount(user.followingCount)}
          </Text>
          <Text style={styles.statLabel}>FOLLOWING</Text>
        </View>
      </View>

      {/* Edit Profile button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate(AUTH_PROFILE_STACK_SCREENS.EDIT_PROFILE)}
        activeOpacity={0.7}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Posts Grid */}
      <View style={styles.postsHeader}>
        <Text style={styles.postsTitle}>Posts</Text>
        {isLoadingPosts && <ActivityIndicator color={Colors.primary_container} />}
      </View>
      <View style={styles.grid}>
        {userPosts.length > 0 ? (
          userPosts.map((post: any) => {
            const imageUrl = post.imageUrl || post.videoUrl;
            return (
              <View key={post.id} style={styles.gridItem}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
                {post.mediaType === 'video' && (
                  <View style={styles.videoOverlay}>
                    <Feather name="play" size={24} color={Colors.surface_bright} />
                  </View>
                )}
                {/* Delete button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePost(post.id)}
                  activeOpacity={0.7}
                  accessibilityLabel="Delete post"
                  accessibilityRole="button">
                  <Feather name="trash-2" size={18} color={Colors.surface_bright} />
                </TouchableOpacity>
              </View>
            );
          })
        ) : !isLoadingPosts ? (
          <View style={styles.emptyState}>
            <Feather name="image" size={48} color={Colors.on_surface_variant} />
            <Text style={styles.emptyStateText}>No posts yet</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.spacing_4,
    paddingVertical: Spacing.spacing_3,
  },
  headerUsername: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    fontWeight: '600',
    fontSize: 18,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.spacing_5,
  },
  displayName: {
    ...Typography.Headline_SM,
    color: Colors.on_surface,
    marginTop: Spacing.spacing_3,
  },
  usernameLabel: {
    ...Typography.Label_SM,
    color: Colors.on_surface_variant,
    marginTop: Spacing.spacing_1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: Spacing.spacing_4,
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.Label_SM,
    color: Colors.on_surface_variant,
    marginTop: 2,
  },
  editButton: {
    backgroundColor: Colors.surface_container_high,
    borderRadius: 999,
    paddingVertical: Spacing.spacing_3,
    marginHorizontal: Spacing.spacing_4,
    alignItems: 'center',
    marginBottom: Spacing.spacing_5,
  },
  editButtonText: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    fontWeight: '600',
  },
  postsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.spacing_4,
    paddingVertical: Spacing.spacing_3,
    marginTop: Spacing.spacing_4,
  },
  postsTitle: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    paddingHorizontal: Spacing.spacing_2,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    backgroundColor: Colors.surface_container_low,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: Spacing.spacing_2,
    right: Spacing.spacing_2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    width: SCREEN_WIDTH,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.spacing_2,
  },
  emptyStateText: {
    ...Typography.Body_MD,
    color: Colors.on_surface_variant,
  },
});
