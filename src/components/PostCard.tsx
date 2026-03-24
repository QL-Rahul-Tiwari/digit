import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Typography, Spacing } from '../theme';
import { Post } from '../types';
import { formatRelativeTime, formatCount } from '../utils/formatDate';
import Avatar from './Avatar';
import VideoPlayer from './VideoPlayer';
import { OnLoadData } from 'react-native-video';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_ASPECT = 1; // 1:1 fallback
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x600/E9E8E8/707884?text=No+Image';

interface PostCardProps {
  post: Post;
  onLike: (postId: string, isLiked: boolean) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onOptions?: (postId: string) => void;
  onProfilePress?: (userId: string) => void;
}

function PostCardInner({
  post,
  onLike,
  onComment,
  onShare,
  onOptions,
  onProfilePress,
}: PostCardProps) {
  const [mediaAspect, setMediaAspect] = useState(DEFAULT_ASPECT);
  const [isMuted, setIsMuted] = useState(true);
  const [mediaError, setMediaError] = useState(false);

  // Defensive: validate critical post fields
  console.log('Rendering PostCard with post:', post);
  const safeUser = post?.user ?? { id: '', username: 'unknown', profilePhoto: '' };
  const isVideo = post?.mediaType === 'video' && !!post?.videoUrl;
  const imageSource = post?.imageUrl || PLACEHOLDER_IMAGE;

  // Memoize computed media height to avoid inline style re-creation
  const mediaHeight = useMemo(
    () => SCREEN_WIDTH * mediaAspect,
    [mediaAspect],
  );

  const handleImageLoad = useCallback(
    (e: any) => {
      // FastImage provides width/height via nativeEvent
      const w = e?.nativeEvent?.width;
      const h = e?.nativeEvent?.height;
      if (w > 0 && h > 0) {
        setMediaAspect(h / w);
      }
    },
    [],
  );

  const handleVideoLoad = useCallback(
    (data: OnLoadData) => {
      const { width, height } = data.naturalSize;
      if (width > 0 && height > 0) {
        // Video naturalSize orientation can be 'landscape' or 'portrait'
        const aspect =
          data.naturalSize.orientation === 'landscape'
            ? height / width
            : width / height;
        setMediaAspect(aspect);
      }
    },
    [],
  );

  const handleMuteToggle = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleMediaError = useCallback(() => {
    setMediaError(true);
  }, []);

  // ─── Render Media ───────────────────────────────────────────
  const renderMedia = () => {
    // Error fallback
    if (mediaError) {
      return (
        <View style={[styles.mediaFallback, { height: SCREEN_WIDTH }]}>
          <Ionicons
            name="image-outline"
            size={48}
            color={Colors.on_surface_variant}
          />
          <Text style={styles.mediaFallbackText}>Unable to load media</Text>
        </View>
      );
    }

    if (isVideo) {
      return (
        <View style={styles.mediaWrapper}>
          <VideoPlayer
            uri={post.videoUrl!}
            posterUri={post.thumbnailUrl || imageSource}
            style={{ height: mediaHeight }}
            muted={isMuted}
            repeat
            // showControls
            onLoad={handleVideoLoad}
          />
          {/* External mute toggle overlay — higher z for reliability */}
          <TouchableOpacity
            style={styles.muteButton}
            onPress={handleMuteToggle}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={isMuted ? 'Unmute video' : 'Mute video'}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name={isMuted ? 'volume-mute' : 'volume-high'}
              size={18}
              color={Colors.surface_bright}
            />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FastImage
        source={{
          uri: imageSource,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        style={[styles.image, { height: mediaHeight }]}
        resizeMode={FastImage.resizeMode.cover}
        onLoad={handleImageLoad}
        onError={handleMediaError}
      />
    );
  };
console.log('PostCard mediaAspect:',safeUser.profilePhoto);
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => onProfilePress?.(safeUser.id)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`View ${safeUser.username}'s profile`}>
          <Avatar uri={safeUser.profilePhoto} size="md" />
          <View style={styles.headerInfo}>
            <Text style={styles.username}>{safeUser.username}</Text>
            {post?.createdAt ? (
              <Text style={styles.timestamp}>
                {formatRelativeTime(post.createdAt)}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onOptions?.(post.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Post options">
          <Feather
            name="more-horizontal"
            size={20}
            color={Colors.on_surface_variant}
          />
        </TouchableOpacity>
      </View>

      {/* Full-bleed Media */}
      {renderMedia()}

      {/* Action row */}
      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity
            onPress={() => onLike(post.id, post.isLiked)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={post.isLiked ? 'Unlike post' : 'Like post'}>
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={26}
              color={post.isLiked ? Colors.primary_container : Colors.on_surface}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment?.(post.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Comment on post">
            <Feather
              name="message-circle"
              size={22}
              color={Colors.on_surface}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onShare?.(post.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Share post">
            <Feather name="send" size={22} color={Colors.on_surface} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Likes count */}
      <View style={styles.captionArea}>
        <Text style={styles.likesCount}>
          {formatCount(post.likesCount ?? 0)} likes
        </Text>
        {/* Caption */}
        {post.caption ? (
          <Text style={styles.caption} numberOfLines={3}>
            <Text style={styles.captionUsername}>{safeUser.username} </Text>
            {post.caption}
          </Text>
        ) : null}
        {/* Comments count */}
        {(post.commentsCount ?? 0) > 0 && (
          <TouchableOpacity
            onPress={() => onComment?.(post.id)}
            accessibilityRole="button"
            accessibilityLabel={`View ${post.commentsCount} comments`}>
            <Text style={styles.viewComments}>
              View all {formatCount(post.commentsCount)} comments
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// React.memo with shallow comparison to prevent unnecessary rerenders in FlatList
const PostCard = React.memo(PostCardInner, (prev, next) => {
  return (
    prev.post.id === next.post.id &&
    prev.post.isLiked === next.post.isLiked &&
    prev.post.likesCount === next.post.likesCount &&
    prev.post.commentsCount === next.post.commentsCount
  );
});

export default PostCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface_container_low,
    marginBottom: Spacing.spacing_5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.spacing_3,
    paddingHorizontal: Spacing.spacing_4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerInfo: {
    marginLeft: Spacing.spacing_3,
  },
  username: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
  },
  timestamp: {
    ...Typography.Label_SM,
    color: Colors.on_surface_variant,
    marginTop: 2,
  },
  image: {
    width: SCREEN_WIDTH,
    backgroundColor: Colors.surface_container_high,
  },
  mediaWrapper: {
    position: 'relative',
  },
  mediaFallback: {
    width: SCREEN_WIDTH,
    backgroundColor: Colors.surface_container_high,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaFallbackText: {
    ...Typography.Label_SM,
    color: Colors.on_surface_variant,
    marginTop: Spacing.spacing_2,
  },
  muteButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.spacing_4,
    paddingVertical: Spacing.spacing_3,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: Spacing.spacing_4,
  },
  captionArea: {
    paddingLeft: Spacing.spacing_6, // Asymmetric editorial push
    paddingRight: Spacing.spacing_4,
    paddingBottom: Spacing.spacing_4,
  },
  likesCount: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    fontWeight: '600',
  },
  caption: {
    ...Typography.Body_MD,
    color: Colors.on_surface,
    marginTop: Spacing.spacing_1,
    lineHeight: 20,
  },
  captionUsername: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
  },
  viewComments: {
    ...Typography.Body_MD,
    color: Colors.on_surface_variant,
    marginTop: Spacing.spacing_1,
  },
});
