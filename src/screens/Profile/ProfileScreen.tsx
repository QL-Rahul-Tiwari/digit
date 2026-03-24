import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../theme';
import { AUTH_PROFILE_STACK_SCREENS } from '../../constants/screenNames';
import { useAuthStore } from '../../store/authStore';
import { fetchMyProfile } from '../../api/users';
import Avatar from '../../components/Avatar';
import { formatCount } from '../../utils/formatDate';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 1;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - GRID_GAP * 2) / 3;

// Stub grid posts for profile
const STUB_GRID_POSTS = Array.from({ length: 12 }, (_, i) => ({
  id: `grid-${i}`,
  imageUrl: `https://picsum.photos/seed/grid${i}/400/400`,
}));

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh profile from server whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          setIsRefreshing(true);
          const freshUser = await fetchMyProfile();
          if (!cancelled && token) {
            await setAuth(token, freshUser);
          }
        } catch {
          // Silently fail — show cached user
        } finally {
          if (!cancelled) setIsRefreshing(false);
        }
      })();
      return () => { cancelled = true; };
    }, [token, setAuth]),
  );

  if (!user) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with settings */}
      <View style={styles.header}>
        <Text style={styles.headerUsername}>{user.username}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(AUTH_PROFILE_STACK_SCREENS.SETTINGS)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="settings" size={22} color={Colors.on_surface} />
        </TouchableOpacity>
      </View>

      {/* Profile info */}
      <View style={styles.profileSection}>
        <Avatar
          uri={user.profilePhoto || 'https://i.pravatar.cc/300?u=default'}
          size="lg"
          showStoryRing
          hasUnviewedStory={false}
        />
        <Text style={styles.displayName}>{user.name}</Text>
        <Text style={styles.usernameLabel}>@{user.username}</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>{formatCount(user.postsCount)}</Text>
          <Text style={styles.statLabel}>POSTS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>
            {formatCount(user.followersCount)}
          </Text>
          <Text style={styles.statLabel}>FOLLOWERS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>
            {formatCount(user.followingCount)}
          </Text>
          <Text style={styles.statLabel}>FOLLOWING</Text>
        </View>
      </View>

      {/* Edit Profile button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate(AUTH_PROFILE_STACK_SCREENS.EDIT_PROFILE)}
        activeOpacity={0.7}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Posts Grid */}
      <View style={styles.grid}>
        {STUB_GRID_POSTS.map((post) => (
          <View key={post.id} style={styles.gridItem}>
            <Image
              source={{ uri: post.imageUrl }}
              style={styles.gridImage}
              resizeMode="cover"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.spacing_4,
    paddingVertical: Spacing.spacing_3,
  },
  headerUsername: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    fontWeight: '600',
    fontSize: 18,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.spacing_5,
  },
  displayName: {
    ...Typography.Headline_SM,
    color: Colors.on_surface,
    marginTop: Spacing.spacing_3,
  },
  usernameLabel: {
    ...Typography.Label_SM,
    color: Colors.on_surface_variant,
    marginTop: Spacing.spacing_1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: Spacing.spacing_4,
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.Label_SM,
    color: Colors.on_surface_variant,
    marginTop: 2,
  },
  editButton: {
    backgroundColor: Colors.surface_container_high,
    borderRadius: 999,
    paddingVertical: Spacing.spacing_3,
    marginHorizontal: Spacing.spacing_4,
    alignItems: 'center',
    marginBottom: Spacing.spacing_5,
  },
  editButtonText: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    backgroundColor: Colors.surface_container_low,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
});
