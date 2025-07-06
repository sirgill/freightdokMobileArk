import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme/index';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert(
        'Login Error',
        err instanceof Error ? err.message : 'An error occurred during login'
      );
    }
  };

  // Test credentials button
  const useTestCredentials = () => {
    setEmail('sgill@sunnyfreight.co');
    setPassword('Ark2216!');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <View style={styles.logoContainer}>
          <View style={[styles.logo, {justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', borderRadius: 60}]}> 
            <Text style={{fontSize: 32, color: '#aaa'}}>Logo</Text>
          </View>
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <TouchableOpacity
            style={styles.visibilityToggle}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Text style={styles.visibilityToggleText}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Test credentials button - remove in production */}
        <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={useTestCredentials}
        >
          <Text style={styles.buttonText}>Use Test Credentials</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.registerTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  form: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: 16,
    color: theme.colors.text,
  },
  visibilityToggle: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  visibilityToggleText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: theme.colors.errorBackground,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  error: {
    color: theme.colors.error,
    textAlign: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  registerTextBold: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: theme.colors.secondary,
    marginTop: 10,
  },
}); 