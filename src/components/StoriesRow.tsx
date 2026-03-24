import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Typography, Spacing } from '../theme';
import { StoryGroup } from '../types';
import StoryCircle from './StoryCircle';
import { useAuthStore } from '../store/authStore';
import Avatar from './Avatar';

interface StoriesRowProps {
  stories: StoryGroup[];
  onStoryPress: (index: number) => void;
  onAddStory: () => void;
}

export default function StoriesRow({ stories, onStoryPress, onAddStory }: StoriesRowProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <View style={styles.container}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.user.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.addStoryContainer}
            onPress={onAddStory}
            activeOpacity={0.7}>
            <View style={styles.avatarWrapper}>
              <Avatar
                uri={user?.profilePhoto || ''}
                size="md"
              />
              <View style={styles.plusBadge}>
                <Ionicons name="add" size={14} color={Colors.on_primary} />
              </View>
            </View>
            <Text style={styles.addStoryLabel} numberOfLines={1}>
              Your story
            </Text>
          </TouchableOpacity>
        }
        renderItem={({ item, index }) => (
          <StoryCircle storyGroup={item} onPress={() => onStoryPress(index)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface_container_low,
    paddingVertical: Spacing.spacing_3,
  },
  listContent: {
    paddingHorizontal: Spacing.spacing_4,
  },
  addStoryContainer: {
    alignItems: 'center',
    marginRight: Spacing.spacing_3,
    width: 72,
  },
  avatarWrapper: {
    position: 'relative',
  },
  plusBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary_container,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface_container_low,
  },
  addStoryLabel: {
    ...Typography.Label_SM,
    color: Colors.on_surface_variant,
    marginTop: Spacing.spacing_1,
    textAlign: 'center',
    width: '100%',
  },
});
