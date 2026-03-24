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
} from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';
import { login } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';

interface LoginScreenProps {
  onNavigateSignUp: () => void;
}

export default function LoginScreen({ onNavigateSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);

  // Focus animations for underline
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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const result = await login({ email, password });
      await setAuth(result.token, result.user);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        'Unable to sign in. Please check your credentials.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Digit</Text>
          <Text style={styles.subtitle}>Welcome back</Text>
        </View>

        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.on_surface_variant}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              onFocus={() => animateFocus(emailFocus, true)}
              onBlur={() => animateFocus(emailFocus, false)}
            />
            <Animated.View
              style={[
                styles.underline,
                { backgroundColor: getUnderlineColor(emailFocus) },
              ]}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.on_surface_variant}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => animateFocus(passwordFocus, true)}
              onBlur={() => animateFocus(passwordFocus, false)}
            />
            <Animated.View
              style={[
                styles.underline,
                { backgroundColor: getUnderlineColor(passwordFocus) },
              ]}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Login button */}
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}>
            {isLoading ? (
              <ActivityIndicator color={Colors.on_primary} />
            ) : (
              <Text style={styles.primaryButtonText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up link */}
          <TouchableOpacity onPress={onNavigateSignUp} style={styles.tertiaryButton}>
            <Text style={styles.tertiaryButtonText}>
              Don't have an account?{' '}
              <Text style={styles.tertiaryButtonBold}>Sign Up</Text>
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
  },
  header: {
    marginBottom: Spacing.spacing_8,
  },
  title: {
    ...Typography.Display_LG,
    color: Colors.on_surface,
    fontSize: 40,
  },
  subtitle: {
    ...Typography.Headline_SM,
    color: Colors.on_surface_variant,
    marginTop: Spacing.spacing_2,
    fontWeight: '400',
  },
  form: {
    gap: Spacing.spacing_5,
  },
  inputContainer: {
    marginBottom: 0,
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
