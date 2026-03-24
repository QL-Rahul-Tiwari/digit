import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Colors, Typography, Spacing } from '../../theme';
import {
  pickMediaFromGallery,
  pickMediaFromCamera,
  PickedMediaType,
} from '../../utils/imageHelpers';
import { uploadMedia } from '../../api/posts';
import { createStory } from '../../api/feed';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AddStoryScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const [mediaUri, setMediaUri] = useState('');
  const [mediaType, setMediaType] = useState<PickedMediaType>('image');
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const focusAnim = useRef(new Animated.Value(0)).current;

  const animateFocus = (focused: boolean) => {
    Animated.timing(focusAnim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const underlineColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.ghost_border_20, Colors.primary_container],
  });

  /* ---------- media pickers ---------- */
  const handlePickGallery = async () => {
    const media = await pickMediaFromGallery();
    if (media) {
      setMediaUri(media.uri);
      setMediaType(media.mediaType);
    }
  };

  const handlePickCamera = async () => {
    const media = await pickMediaFromCamera();
    if (media) {
      setMediaUri(media.uri);
      setMediaType(media.mediaType);
    }
  };

  const handleRemoveMedia = () => {
    setMediaUri('');
    setMediaType('image');
  };

  /* ---------- submit ---------- */
  const handleShare = async () => {
    if (!mediaUri) return;
    setIsUploading(true);
    try {
      const isVideo = mediaType === 'video';
      const mediaUrl = await uploadMedia(
        mediaUri,
        isVideo ? 'video/mp4' : 'image/jpeg',
        isVideo ? 'story.mp4' : 'story.jpg',
      );

      await createStory({ content: content.trim(), mediaUrl });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      navigation.goBack();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to add story.';
      Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsUploading(false);
    }
  };

  /* ---------- render ---------- */
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* ──── Header ──── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Close"
            accessibilityRole="button">
            <Ionicons name="close" size={28} color={Colors.on_surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Story</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* ──── Media Preview / Picker ──── */}
        {mediaUri ? (
          <View style={styles.previewWrapper}>
            {mediaType === 'video' ? (
              <View style={styles.videoPreviewContainer}>
                <Video
                  source={{ uri: mediaUri }}
                  style={styles.mediaPreview}
                  resizeMode="cover"
                  paused={false}
                  muted
                  repeat
                />
                <View style={styles.videoTag}>
                  <Ionicons name="videocam" size={14} color={Colors.surface_bright} />
                  <Text style={styles.videoTagText}>VIDEO</Text>
                </View>
              </View>
            ) : (
              <Image
                source={{ uri: mediaUri }}
                style={styles.mediaPreview}
                resizeMode="cover"
              />
            )}

            {/* Re-pick / remove overlay */}
            <View style={styles.mediaActions}>
              <TouchableOpacity
                style={styles.mediaActionBtn}
                onPress={handlePickGallery}
                accessibilityLabel="Change media from gallery">
                <Feather name="image" size={18} color={Colors.surface_bright} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mediaActionBtn}
                onPress={handlePickCamera}
                accessibilityLabel="Change media from camera">
                <Feather name="camera" size={18} color={Colors.surface_bright} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mediaActionBtn}
                onPress={handleRemoveMedia}
                accessibilityLabel="Remove media">
                <Feather name="trash-2" size={18} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderTitle}>Add to your story</Text>
            <Text style={styles.placeholderSubtitle}>
              Pick a photo or video to share
            </Text>

            <View style={styles.pickButtons}>
              <TouchableOpacity
                style={styles.pickButton}
                onPress={handlePickGallery}
                activeOpacity={0.7}
                accessibilityLabel="Pick from gallery">
                <View style={styles.pickIconCircle}>
                  <Feather name="image" size={28} color={Colors.primary_container} />
                </View>
                <Text style={styles.pickButtonLabel}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pickButton}
                onPress={handlePickCamera}
                activeOpacity={0.7}
                accessibilityLabel="Take photo or video">
                <View style={styles.pickIconCircle}>
                  <Feather name="camera" size={28} color={Colors.primary_container} />
                </View>
                <Text style={styles.pickButtonLabel}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ──── Content input ──── */}
        <View style={styles.captionContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Add a caption to your story…"
            placeholderTextColor={Colors.on_surface_variant}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={500}
            onFocus={() => animateFocus(true)}
            onBlur={() => animateFocus(false)}
          />
          <Animated.View
            style={[styles.underline, { backgroundColor: underlineColor }]}
          />
        </View>

        {/* ──── Share button ──── */}
        <TouchableOpacity
          style={[
            styles.shareButton,
            (!mediaUri || isUploading) && styles.shareButtonDisabled,
          ]}
          onPress={handleShare}
          disabled={!mediaUri || isUploading}
          activeOpacity={0.8}
          accessibilityLabel="Share story"
          accessibilityRole="button">
          {isUploading ? (
            <ActivityIndicator color={Colors.on_primary} />
          ) : (
            <Text style={styles.shareButtonText}>Share Story</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ──────────── Styles ──────────── */
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flexGrow: 1,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.spacing_4,
    paddingVertical: Spacing.spacing_3,
  },
  headerTitle: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    fontWeight: '600',
  },

  /* Media preview */
  previewWrapper: {
    position: 'relative',
  },
  mediaPreview: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  videoPreviewContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: Colors.on_surface,
  },
  videoTag: {
    position: 'absolute',
    top: Spacing.spacing_3,
    right: Spacing.spacing_3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    paddingHorizontal: Spacing.spacing_2,
    paddingVertical: 3,
    gap: 4,
  },
  videoTagText: {
    ...Typography.Label_SM,
    color: Colors.surface_bright,
    fontSize: 10,
  },
  mediaActions: {
    position: 'absolute',
    bottom: Spacing.spacing_3,
    right: Spacing.spacing_3,
    flexDirection: 'row',
    gap: Spacing.spacing_2,
  },
  mediaActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Placeholder / picker */
  placeholderContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: Colors.surface_container_low,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.spacing_2,
  },
  placeholderTitle: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    fontWeight: '600',
    marginBottom: Spacing.spacing_1,
  },
  placeholderSubtitle: {
    ...Typography.Body_MD,
    color: Colors.on_surface_variant,
    marginBottom: Spacing.spacing_5,
  },
  pickButtons: {
    flexDirection: 'row',
    gap: Spacing.spacing_8,
  },
  pickButton: {
    alignItems: 'center',
    gap: Spacing.spacing_2,
  },
  pickIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface_container_high,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickButtonLabel: {
    ...Typography.Label_SM,
    color: Colors.on_surface_variant,
  },

  /* Caption */
  captionContainer: {
    paddingHorizontal: Spacing.spacing_6,
    paddingTop: Spacing.spacing_5,
  },
  captionInput: {
    ...Typography.Body_MD,
    color: Colors.on_surface,
    fontSize: 16,
    paddingVertical: Spacing.spacing_3,
    paddingHorizontal: 0,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: Colors.transparent,
  },
  underline: {
    height: 1,
    width: '100%',
  },

  /* Share */
  shareButton: {
    backgroundColor: Colors.primary_container,
    borderRadius: 999,
    paddingVertical: Spacing.spacing_4,
    marginHorizontal: Spacing.spacing_6,
    marginTop: Spacing.spacing_6,
    marginBottom: Spacing.spacing_8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareButtonText: {
    ...Typography.Title_SM,
    color: Colors.on_primary,
    fontWeight: '600',
  },
});
