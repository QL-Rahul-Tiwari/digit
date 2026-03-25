import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Typography, Spacing } from '../theme';

interface OfflineBannerProps {
  isVisible: boolean;
}

export default function OfflineBanner({ isVisible }: OfflineBannerProps) {
  const slideAnim = React.useRef(new Animated.Value(isVisible ? 0 : -50)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -50,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, slideAnim]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}>
      <Feather name="wifi-off" size={16} color={Colors.surface_bright} />
      <Text style={styles.text}>No internet connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.spacing_2,
    paddingVertical: Spacing.spacing_3,
    paddingHorizontal: Spacing.spacing_4,
  },
  text: {
    ...Typography.Label_SM,
    color: Colors.surface_bright,
    fontWeight: '500',
  },
});
