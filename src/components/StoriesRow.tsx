import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../theme';
import { StoryGroup } from '../types';
import StoryCircle from './StoryCircle';

interface StoriesRowProps {
  stories: StoryGroup[];
  onStoryPress: (index: number) => void;
}

export default function StoriesRow({ stories, onStoryPress }: StoriesRowProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.user.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
});
