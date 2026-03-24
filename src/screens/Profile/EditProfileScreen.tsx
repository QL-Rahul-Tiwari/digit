import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { pickImageFromGallery } from '../../utils/imageHelpers';
import { uploadMedia } from '../../api/posts';
import { updateProfile } from '../../api/users';
import Avatar from '../../components/Avatar';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const [username, setUsername] = useState(user?.username ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [photoUri, setPhotoUri] = useState(user?.profilePhoto ?? '');
  const [isNewPhoto, setIsNewPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const usernameFocus = useRef(new Animated.Value(0)).current;
  const bioFocus = useRef(new Animated.Value(0)).current;

  const animateFocus = (anim: Animated.Value, focused: boolean) => {
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const getUnderlineColor = (anim: Animated.Value) =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.ghost_border_20, Colors.primary_container],
    });

  const handlePickPhoto = async () => {
    const image = await pickImageFromGallery();
    if (image) {
      setPhotoUri(image.uri);
      setIsNewPhoto(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let profilePicture = user?.profilePhoto ?? '';

      // Upload new photo if user picked one
      if (isNewPhoto && photoUri) {
        profilePicture = await uploadMedia(photoUri, 'image/jpeg', 'profile.jpg');
      }

      const updatedUser = await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        profilePicture,
      });

      // Persist updated user in auth store
      if (token) {
        await setAuth(token, updatedUser);
      }

      navigation.goBack();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        'Failed to update profile. Please try again.';
      Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={28} color={Colors.on_surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            {isSaving ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={styles.doneText}>Done</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Photo */}
        <TouchableOpacity
          style={styles.photoPicker}
          onPress={handlePickPhoto}
          activeOpacity={0.7}>
          <Avatar
            uri={photoUri || 'https://i.pravatar.cc/300?u=default'}
            size="lg"
          />
          <Text style={styles.changePhotoText}>CHANGE PHOTO</Text>
        </TouchableOpacity>

        {/* Fields */}
        <View style={styles.fields}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>USERNAME</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              onFocus={() => animateFocus(usernameFocus, true)}
              onBlur={() => animateFocus(usernameFocus, false)}
            />
            <Animated.View
              style={[
                styles.underline,
                { backgroundColor: getUnderlineColor(usernameFocus) },
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>BIO</Text>
            <TextInput
              style={[styles.input, { minHeight: 60 }]}
              value={bio}
              onChangeText={setBio}
              multiline
              maxLength={150}
              onFocus={() => animateFocus(bioFocus, true)}
              onBlur={() => animateFocus(bioFocus, false)}
            />
            <Animated.View
              style={[
                styles.underline,
                { backgroundColor: getUnderlineColor(bioFocus) },
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flexGrow: 1,
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
  doneText: {
    ...Typography.Title_SM,
    color: Colors.primary,
    fontWeight: '700',
  },
  photoPicker: {
    alignItems: 'center',
    paddingVertical: Spacing.spacing_5,
  },
  changePhotoText: {
    ...Typography.Label_SM,
    color: Colors.primary,
    marginTop: Spacing.spacing_3,
  },
  fields: {
    paddingHorizontal: Spacing.spacing_6,
    gap: Spacing.spacing_5,
  },
  inputContainer: {},
  fieldLabel: {
    ...Typography.Label_SM,
    color: Colors.on_surface_variant,
    marginBottom: Spacing.spacing_1,
  },
  input: {
    ...Typography.Body_MD,
    color: Colors.on_surface,
    fontSize: 16,
    paddingVertical: Spacing.spacing_3,
    paddingHorizontal: 0,
    backgroundColor: Colors.transparent,
  },
  underline: {
    height: 1,
    width: '100%',
  },
});
