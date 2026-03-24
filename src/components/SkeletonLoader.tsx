import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors, Spacing } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonLoaderProps {
  count?: number;
}

function ShimmerBlock({
  width,
  height,
  borderRadius = 0,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: Colors.surface_container_high,
          opacity,
        },
        style,
      ]}
    />
  );
}

function SkeletonCard() {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <ShimmerBlock width={56} height={56} borderRadius={28} />
        <View style={styles.headerText}>
          <ShimmerBlock width={120} height={14} borderRadius={4} />
          <ShimmerBlock
            width={80}
            height={10}
            borderRadius={4}
            style={{ marginTop: Spacing.spacing_1 }}
          />
        </View>
      </View>
      {/* Image */}
      <ShimmerBlock
        width={SCREEN_WIDTH}
        height={SCREEN_WIDTH}
        style={{ marginTop: Spacing.spacing_3 }}
      />
      {/* Caption */}
      <View style={styles.captionArea}>
        <ShimmerBlock width={SCREEN_WIDTH * 0.7} height={14} borderRadius={4} />
        <ShimmerBlock
          width={SCREEN_WIDTH * 0.5}
          height={14}
          borderRadius={4}
          style={{ marginTop: Spacing.spacing_2 }}
        />
      </View>
    </View>
  );
}

export default function SkeletonLoader({ count = 2 }: SkeletonLoaderProps) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface_container_low,
    marginBottom: Spacing.spacing_5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.spacing_3,
    paddingHorizontal: Spacing.spacing_4,
  },
  headerText: {
    marginLeft: Spacing.spacing_3,
  },
  captionArea: {
    paddingVertical: Spacing.spacing_3,
    paddingLeft: Spacing.spacing_6,
    paddingRight: Spacing.spacing_4,
  },
});
