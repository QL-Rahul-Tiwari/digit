import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Typography, Spacing } from '../../theme';
import { register } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import { pickImageFromGallery } from '../../utils/imageHelpers';

interface SignUpScreenProps {
  onNavigateLogin: () => void;
}

export default function SignUpScreen({ onNavigateLogin }: SignUpScreenProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);

  // Focus animations
  const nameFocus = useRef(new Animated.Value(0)).current;
  const usernameFocus = useRef(new Animated.Value(0)).current;
  const emailFocus = useRef(new Animated.Value(0)).current;
  const passwordFocus = useRef(new Animated.Value(0)).current;

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
      setProfilePhoto(image.uri);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const result = await register({ name, username, email, password, profilePhoto });
      await setAuth(result.token, result.user);
    } catch {
      setError('Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    placeholder: string,
    value: string,
    onChange: (t: string) => void,
    focusAnim: Animated.Value,
    options?: {
      secureTextEntry?: boolean;
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
      keyboardType?: 'default' | 'email-address';
    },
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.on_surface_variant}
        value={value}
        onChangeText={onChange}
        secureTextEntry={options?.secureTextEntry}
        autoCapitalize={options?.autoCapitalize ?? 'none'}
        keyboardType={options?.keyboardType ?? 'default'}
        onFocus={() => animateFocus(focusAnim, true)}
        onBlur={() => animateFocus(focusAnim, false)}
      />
      <Animated.View
        style={[
          styles.underline,
          { backgroundColor: getUnderlineColor(focusAnim) },
        ]}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the community</Text>
        </View>

        {/* Profile Photo Picker */}
        <TouchableOpacity
          style={styles.photoPicker}
          onPress={handlePickPhoto}
          activeOpacity={0.7}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.photoPreview} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Feather name="camera" size={28} color={Colors.on_surface_variant} />
            </View>
          )}
          <Text style={styles.photoLabel}>ADD PHOTO</Text>
        </TouchableOpacity>

        <View style={styles.form}>
          {renderInput('Full Name', name, setName, nameFocus, {
            autoCapitalize: 'words',
          })}
          {renderInput('Username', username, setUsername, usernameFocus)}
          {renderInput('Email', email, setEmail, emailFocus, {
            keyboardType: 'email-address',
          })}
          {renderInput('Password', password, setPassword, passwordFocus, {
            secureTextEntry: true,
          })}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
            activeOpacity={0.8}>
            {isLoading ? (
              <ActivityIndicator color={Colors.on_primary} />
            ) : (
              <Text style={styles.primaryButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onNavigateLogin} style={styles.tertiaryButton}>
            <Text style={styles.tertiaryButtonText}>
              Already have an account?{' '}
              <Text style={styles.tertiaryButtonBold}>Log In</Text>
            </Text>
          </TouchableOpacity>
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
    paddingHorizontal: Spacing.spacing_6,
    justifyContent: 'center',
    paddingVertical: Spacing.spacing_8,
  },
  header: {
    marginBottom: Spacing.spacing_6,
  },
  title: {
    ...Typography.Headline_SM,
    color: Colors.on_surface,
    fontSize: 32,
  },
  subtitle: {
    ...Typography.Body_MD,
    color: Colors.on_surface_variant,
    marginTop: Spacing.spacing_1,
    fontSize: 16,
  },
  photoPicker: {
    alignItems: 'center',
    marginBottom: Spacing.spacing_6,
  },
  photoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surface_container_high,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPreview: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  photoLabel: {
    ...Typography.Label_SM,
    color: Colors.primary,
    marginTop: Spacing.spacing_2,
  },
  form: {
    gap: Spacing.spacing_5,
  },
  inputContainer: {},
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
  errorText: {
    ...Typography.Label_SM,
    color: Colors.on_surface_variant,
  },
  primaryButton: {
    backgroundColor: Colors.primary_container,
    borderRadius: 999,
    paddingVertical: Spacing.spacing_4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.spacing_2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    ...Typography.Title_SM,
    color: Colors.on_primary,
    fontWeight: '600',
  },
  tertiaryButton: {
    alignItems: 'center',
    paddingVertical: Spacing.spacing_3,
  },
  tertiaryButtonText: {
    ...Typography.Body_MD,
    color: Colors.on_surface_variant,
  },
  tertiaryButtonBold: {
    ...Typography.Title_SM,
    color: Colors.primary,
    fontWeight: '700',
  },
});
