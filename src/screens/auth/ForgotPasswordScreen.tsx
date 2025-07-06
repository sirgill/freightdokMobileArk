import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { theme } from '../../theme/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const handleForgotPassword = async (values: { email: string }) => {
    try {
      // TODO: Implement forgot password logic
      console.log('Forgot password values:', values);
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you instructions to reset your password.
      </Text>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleForgotPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              mode="outlined"
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email && !!errors.email}
              style={styles.input}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.button}
            >
              Send Reset Instructions
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
            >
              Back to Login
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  form: {
    gap: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.background,
  },
  button: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  linkButton: {
    marginTop: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: -theme.spacing.sm,
  },
});

export default ForgotPasswordScreen; 