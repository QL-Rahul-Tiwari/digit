import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Spacing } from '../theme';
import { AvatarSize, AVATAR_SIZES } from '../types';

interface AvatarProps {
  uri: string;
  size: AvatarSize;
  showStoryRing?: boolean;
  hasUnviewedStory?: boolean;
}

export default function Avatar({
  uri,
  size,
  showStoryRing = false,
  hasUnviewedStory = false,
}: AvatarProps) {
  const dimension = AVATAR_SIZES[size];
  const ringGap = 2;
  const ringWidth = 2;
  const totalRingSize = dimension + (ringGap + ringWidth) * 2;

  if (showStoryRing) {
    return (
      <LinearGradient
        colors={
          hasUnviewedStory
            ? [Colors.story_gradient_start, Colors.story_gradient_end]
            : [Colors.outline_variant, Colors.outline_variant]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradientRing,
          {
            width: totalRingSize,
            height: totalRingSize,
            borderRadius: totalRingSize / 2,
          },
        ]}>
        <View
          style={[
            styles.ringGap,
            {
              width: dimension + ringGap * 2,
              height: dimension + ringGap * 2,
              borderRadius: (dimension + ringGap * 2) / 2,
            },
          ]}>
          <Image
            source={{ uri }}
            style={[
              styles.image,
              {
                width: dimension,
                height: dimension,
                borderRadius: dimension / 2,
              },
            ]}
          />
        </View>
      </LinearGradient>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[
        styles.image,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  gradientRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringGap: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    backgroundColor: Colors.surface_container_high,
  },
});
