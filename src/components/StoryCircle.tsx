import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';
import { StoryGroup } from '../types';
import Avatar from './Avatar';

interface StoryCircleProps {
  storyGroup: StoryGroup;
  onPress: () => void;
}

export default function StoryCircle({ storyGroup, onPress }: StoryCircleProps) {
  const { user, hasUnviewed } = storyGroup;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      <Avatar
        uri={user.profilePhoto}
        size="md"
        showStoryRing
        hasUnviewedStory={hasUnviewed}
      />
      <Text style={styles.username} numberOfLines={1}>
        {user.username}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: Spacing.spacing_3,
    width: 72,
  },
  username: {
    ...Typography.Label_SM,
    color: Colors.on_surface,
    marginTop: Spacing.spacing_1,
    textAlign: 'center',
    width: '100%',
  },
});
