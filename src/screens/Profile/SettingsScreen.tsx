import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { useSocketStore } from '../../store/socketStore';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const disconnect = useSocketStore((s) => s.disconnect);

  const handleLogout = async () => {
    disconnect();
    await clearAuth();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={28} color={Colors.on_surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Logout */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLogout}
          activeOpacity={0.7}>
          <MaterialIcons name="logout" size={22} color={Colors.on_surface} />
          <Text style={styles.menuText}>Log Out</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.spacing_4,
    paddingVertical: Spacing.spacing_3,
  },
  headerTitle: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    fontWeight: '600',
  },
  content: {
    paddingTop: Spacing.spacing_5,
    paddingHorizontal: Spacing.spacing_4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.spacing_4,
  },
  menuText: {
    ...Typography.Title_SM,
    color: Colors.on_surface,
    marginLeft: Spacing.spacing_3,
  },
});
