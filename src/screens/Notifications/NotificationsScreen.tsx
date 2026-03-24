import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Typography, Spacing } from '../../theme';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>
      <View style={styles.emptyState}>
        <Ionicons name="heart-outline" size={48} color={Colors.on_surface_variant} />
        <Text style={styles.emptyText}>No activity yet</Text>
        <Text style={styles.emptySubtext}>
          When someone interacts with you, you'll see it here
        </Text>
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
    textAlign: 'center',
    paddingHorizontal: Spacing.spacing_8,
  },
});
