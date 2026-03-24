import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Video, { OnLoadData, OnProgressData } from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VideoPlayerProps {
  uri: string;
  posterUri?: string;
  style?: object;
  paused?: boolean;
  muted?: boolean;
  repeat?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  onLoad?: (data: OnLoadData) => void;
  onProgress?: (data: OnProgressData) => void;
  onEnd?: () => void;
  showControls?: boolean;
}

export default function VideoPlayer({
  uri,
  posterUri,
  style,
  paused: externalPaused,
  muted: externalMuted,
  repeat = false,
  resizeMode = 'cover',
  onLoad,
  onProgress,
  onEnd,
  showControls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<any>(null);
  const [internalPaused, setInternalPaused] = useState(false);
  const [internalMuted, setInternalMuted] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);

  const isPaused =
    externalPaused !== undefined ? externalPaused : internalPaused;
  const isMuted =
    externalMuted !== undefined ? externalMuted : internalMuted;

  const handleTap = useCallback(() => {
    if (externalPaused !== undefined) return; // controlled externally
    setInternalPaused(prev => !prev);
  }, [externalPaused]);

  const handleMuteToggle = useCallback(() => {
    if (externalMuted !== undefined) return; // controlled externally
    setInternalMuted(prev => !prev);
  }, [externalMuted]);

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={[styles.container, style]}>
        <Video
          ref={videoRef}
          source={{ uri }}
          style={styles.video}
          paused={isPaused}
          muted={isMuted}
          repeat={repeat}
          resizeMode={resizeMode}
          poster={posterUri}
          posterResizeMode="cover"
          onLoad={(data: OnLoadData) => {
            setIsBuffering(false);
            onLoad?.(data);
          }}
          onBuffer={({ isBuffering: buffering }: { isBuffering: boolean }) =>
            setIsBuffering(buffering)
          }
          onProgress={onProgress}
          onEnd={onEnd}
        />

        {/* Buffering indicator */}
        {isBuffering && (
          <View style={styles.bufferingOverlay}>
            <ActivityIndicator size="large" color={Colors.surface_bright} />
          </View>
        )}

        {/* Pause icon overlay */}
        {showControls && isPaused && !isBuffering && (
          <View style={styles.pauseOverlay}>
            <View style={styles.pauseCircle}>
              <Ionicons name="play" size={30} color={Colors.surface_bright} />
            </View>
          </View>
        )}

        {/* Mute toggle button */}
        {showControls && (
          <TouchableWithoutFeedback onPress={handleMuteToggle}>
            <View style={styles.muteButton}>
              <Ionicons
                name={isMuted ? 'volume-mute' : 'volume-high'}
                size={16}
                color={Colors.surface_bright}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: Colors.on_surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  muteButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
