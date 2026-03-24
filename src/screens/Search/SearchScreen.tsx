import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Typography, Spacing } from '../../theme';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>
      <View style={styles.emptyState}>
        <Feather name="search" size={48} color={Colors.on_surface_variant} />
        <Text style={styles.emptyText}>Discover people and content</Text>
        <Text style={styles.emptySubtext}>Search functionality coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    paddingHorizontal: Spacing.spacing_4,
    paddingVertical: Spacing.spacing_3,
  },
  headerTitle: {
    ...Typography.Headline_SM,
    color: Colors.on_surface,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.spacing_8 * 2,
  },
  emptyText: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    marginTop: Spacing.spacing_4,
  },
  emptySubtext: {
    ...Typography.Body_MD,
    color: Colors.on_surface_variant,
    marginTop: Spacing.spacing_2,
  },
});
