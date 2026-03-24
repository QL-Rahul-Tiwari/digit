import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography } from '../../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(onFinish, 800);
    });
  }, [fadeAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Digit
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.Display_LG,
    color: Colors.on_surface,
  },
});
