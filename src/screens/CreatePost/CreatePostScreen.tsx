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
} from 'react-native';
import Video from 'react-native-video';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../theme';
import { useCreatePost } from '../../hooks/useCreatePost';
import {
  pickMediaFromGallery,
  pickMediaFromCamera,
  PickedMediaType,
} from '../../utils/imageHelpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [mediaUri, setMediaUri] = useState<string>('');
  const [mediaType, setMediaType] = useState<PickedMediaType>('image');
  const [caption, setCaption] = useState('');
  const [captionError, setCaptionError] = useState('');
  const createPostMutation = useCreatePost();

  const captionFocus = useRef(new Animated.Value(0)).current;

  const animateFocus = (focused: boolean) => {
    Animated.timing(captionFocus, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const underlineColor = captionFocus.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.ghost_border_20, Colors.primary_container],
  });

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

  const handleShare = async () => {
    // Validate caption
    if (!caption.trim()) {
      setCaptionError('Caption is required');
      return;
    }
    if (caption.trim().length < 3) {
      setCaptionError('Caption must be at least 3 characters');
      return;
    }

    if (!mediaUri) return;
    const isVideo = mediaType === 'video';

    createPostMutation.mutate(
      {
        fileUri: mediaUri,
        mimeType: isVideo ? 'video/mp4' : 'image/jpeg',
        fileName: isVideo ? 'post.mp4' : 'post.jpg',
        content: caption,
      },
      {
        onSuccess: () => {
          setMediaUri('');
          setCaption('');
          setCaptionError('');
          navigation.goBack();
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={Colors.on_surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Media preview area */}
        {mediaUri ? (
          mediaType === 'video' ? (
            <View style={styles.videoPreviewContainer}>
              <Video
                source={{ uri: mediaUri }}
                style={styles.imagePreview}
                resizeMode="cover"
                paused={false}
                muted={true}
                repeat={true}
              />
              <View style={styles.videoTag}>
                <Ionicons
                  name="videocam"
                  size={14}
                  color={Colors.surface_bright}
                />
                <Text style={styles.videoTagText}>VIDEO</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setMediaUri('');
                  setMediaType('image');
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="trash-2" size={18} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: mediaUri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setMediaUri('');
                  setMediaType('image');
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="trash-2" size={18} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          )
        ) : (
          <View style={styles.imagePlaceholder}>
            <View style={styles.pickButtons}>
              <TouchableOpacity
                style={styles.pickButton}
                onPress={handlePickGallery}
                activeOpacity={0.7}
              >
                <Feather
                  name="image"
                  size={28}
                  color={Colors.on_surface_variant}
                />
                <Text style={styles.pickButtonLabel}>GALLERY</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pickButton}
                onPress={handlePickCamera}
                activeOpacity={0.7}
              >
                <Feather
                  name="camera"
                  size={28}
                  color={Colors.on_surface_variant}
                />
                <Text style={styles.pickButtonLabel}>CAMERA</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Caption input */}
        <View style={styles.captionContainer}>
          <TextInput
            style={
              captionError
                ? [styles.captionInput, styles.captionInputError]
                : styles.captionInput
            }
            placeholder="Write a caption..."
            placeholderTextColor={Colors.on_surface_variant}
            value={caption}
            onChangeText={text => {
              setCaption(text);
              setCaptionError(''); // Clear error as user types
            }}
            multiline
            maxLength={2200}
            onFocus={() => animateFocus(true)}
            onBlur={() => animateFocus(false)}
          />
          <Animated.View
            style={[styles.underline, { backgroundColor: underlineColor }]}
          />
          {captionError ? (
            <Text style={styles.errorText}>{captionError}</Text>
          ) : null}
        </View>

        {/* Share button */}
        <TouchableOpacity
          style={[
            styles.shareButton,
            (!mediaUri || !caption.trim() || createPostMutation.isPending) &&
              styles.shareButtonDisabled,
          ]}
          onPress={handleShare}
          disabled={
            !mediaUri || !caption.trim() || createPostMutation.isPending
          }
          activeOpacity={0.8}
        >
          {createPostMutation.isPending ? (
            <ActivityIndicator color={Colors.on_primary} />
          ) : (
            <Text style={styles.shareButtonText}>Share</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flexGrow: 1,
  },
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
  imagePreview: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  imagePreviewContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    position: 'relative',
  },
  videoPreviewContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: Colors.on_surface,
  },
  deleteButton: {
    position: 'absolute',
    top: Spacing.spacing_3,
    right: Spacing.spacing_3,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 999,
    padding: Spacing.spacing_2,
  },
  videoTag: {
    position: 'absolute',
    top: Spacing.spacing_3,
    right: Spacing.spacing_3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
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
  imagePlaceholder: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: Colors.surface_container_low,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickButtons: {
    flexDirection: 'row',
    gap: Spacing.spacing_8,
  },
  pickButton: {
    alignItems: 'center',
    gap: Spacing.spacing_2,
  },
  pickButtonLabel: {
    ...Typography.Label_SM,
    color: Colors.on_surface_variant,
  },
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
  captionInputError: {
    color: '#E53935',
  },
  underline: {
    height: 1,
    width: '100%',
  },
  errorText: {
    ...Typography.Body_MD,
    color: '#E53935',
    marginTop: Spacing.spacing_2,
    fontSize: 12,
  },
  shareButton: {
    backgroundColor: Colors.primary_container,
    borderRadius: 999,
    paddingVertical: Spacing.spacing_4,
    marginHorizontal: Spacing.spacing_6,
    marginTop: Spacing.spacing_6,
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
