import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Button, Card, Input } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

export const LoginScreen: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      console.log('Login successful:', formData.email);
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please try again.';
      
      Alert.alert('Login Error', errorMessage);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Navigate to forgot password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>freightdok</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          {/* Login Form */}
          <Card style={styles.formCard}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              style={styles.loginButton}
            />

            <Button
              title="Forgot Password?"
              onPress={handleForgotPassword}
              variant="outline"
              fullWidth
              style={styles.forgotButton}
            />
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text style={styles.linkText}>Contact support</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.padding.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.margin.xl,
  },
  logo: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.extraBold,
    color: colors.primary,
    marginBottom: spacing.margin.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: spacing.margin.lg,
  },
  loginButton: {
    marginTop: spacing.margin.md,
  },
  forgotButton: {
    marginTop: spacing.margin.sm,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  linkText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default LoginScreen; 