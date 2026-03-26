import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Video, { OnLoadData, OnProgressData } from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../theme';
import { useStories } from '../../hooks/useStories';
import Avatar from '../../components/Avatar';
import { formatRelativeTime } from '../../utils/formatDate';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORY_IMAGE_DURATION = 5000;

type StoryViewerParams = {
  StoryViewer: { initialIndex: number };
};

export default function StoryViewerScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<StoryViewerParams, 'StoryViewer'>>();
  const { initialIndex } = route.params;
  const { data: storyGroups } = useStories();

  const [groupIndex, setGroupIndex] = useState(initialIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const currentGroup = storyGroups?.[groupIndex];
  const currentStory = currentGroup?.stories[storyIndex];
  const totalStories = currentGroup?.stories.length ?? 0;
  const isVideo = currentStory?.mediaType === 'video';

  // Determine the duration for progress bar
  const storyDuration = isVideo
    ? (currentStory?.duration ?? videoDuration ?? 10000)
    : STORY_IMAGE_DURATION;

  const startProgress = useCallback(() => {
    progressAnim.setValue(0);
    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: storyDuration,
      useNativeDriver: false,
    });
    animationRef.current.start(({ finished }) => {
      if (finished && !isPaused) {
        goNext();
      }
    });
  }, [storyDuration, isPaused]);

  const goNext = useCallback(() => {
    if (storyIndex < totalStories - 1) {
      setStoryIndex((prev) => prev + 1);
    } else if (storyGroups && groupIndex < storyGroups.length - 1) {
      setGroupIndex((prev: number) => prev + 1);
      setStoryIndex(0);
    } else {
      navigation.goBack();
    }
  }, [storyIndex, totalStories, groupIndex, storyGroups, navigation]);

  const goPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1);
    } else if (groupIndex > 0) {
      setGroupIndex((prev: number) => prev - 1);
      setStoryIndex(0);
    }
  }, [storyIndex, groupIndex]);

  useEffect(() => {
    startProgress();
    return () => {
      animationRef.current?.stop();
    };
  }, [storyIndex, groupIndex, startProgress]);

  const handleLeftTap = () => {
    animationRef.current?.stop();
    goPrev();
  };

  const handleRightTap = () => {
    animationRef.current?.stop();
    goNext();
  };

  if (!currentGroup || !currentStory) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={styles.storyContainer}>
        {/* Media: Video or Image */}
        {isVideo && currentStory.videoUrl ? (
          <Video
            source={{ uri: currentStory.videoUrl }}
            style={styles.storyImage}
            resizeMode="cover"
            paused={isPaused}
            muted={isMuted}
            poster={currentStory.imageUrl}
            onLoad={(data: OnLoadData) => {
              setVideoDuration(data.duration * 1000);
            }}
            onEnd={goNext}
          />
        ) : (
          <Image
            source={{ uri: currentStory.imageUrl }}
            style={styles.storyImage}
            resizeMode="cover"
          />
        )}

        {/* Overlay touchable areas for left/right navigation */}
        <View style={styles.touchOverlayLeft}>
          <TouchableOpacity
            activeOpacity={0.1}
            onPress={handleLeftTap}
            style={styles.touchArea}
          />
        </View>
        <View style={styles.touchOverlayRight}>
          <TouchableOpacity
            activeOpacity={0.1}
            onPress={handleRightTap}
            style={styles.touchArea}
          />
        </View>

        {/* Progress bars */}
        <View style={styles.progressContainer}>
          {currentGroup.stories.map((_: any, idx: number) => (
            <View key={idx} style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width:
                      idx < storyIndex
                        ? '100%'
                        : idx === storyIndex
                        ? progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          })
                        : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Header with user info */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar uri={currentGroup.user.profilePhoto} size="sm" />
            <Text style={styles.username}>{currentGroup.user.username}</Text>
            <Text style={styles.timestamp}>
              {formatRelativeTime(currentStory.createdAt)}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {/* Mute toggle for video stories */}
            {isVideo && (
              <TouchableOpacity
                onPress={() => setIsMuted((m) => !m)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.muteButton}>
                <Ionicons
                  name={isMuted ? 'volume-mute' : 'volume-high'}
                  size={20}
                  color={Colors.surface_bright}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={28} color={Colors.surface_bright} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.on_surface,
  },
  storyContainer: {
    flex: 1,
  },
  storyImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  touchOverlayLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN_WIDTH / 3,
    height: SCREEN_HEIGHT,
    zIndex: 10,
  },
  touchOverlayRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: SCREEN_WIDTH / 3,
    height: SCREEN_HEIGHT,
    zIndex: 10,
  },
  touchArea: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.spacing_2,
    paddingTop: Spacing.spacing_2,
    gap: 3,
    zIndex: 20,
  },
  progressTrack: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.surface_container_high,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary_container,
    borderRadius: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.spacing_4,
    paddingTop: Spacing.spacing_3,
    zIndex: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    ...Typography.Title_SM,
    color: Colors.surface_bright,
    marginLeft: Spacing.spacing_2,
  },
  timestamp: {
    ...Typography.Label_SM,
    color: Colors.surface_container_high,
    marginLeft: Spacing.spacing_2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.spacing_3,
  },
  muteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});