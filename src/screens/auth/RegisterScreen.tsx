import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { theme } from '../../theme/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterScreen = ({ navigation }: Props) => {
  const handleRegister = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      // TODO: Implement registration logic
      console.log('Register values:', values);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              mode="outlined"
              label="First Name"
              value={values.firstName}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              error={touched.firstName && !!errors.firstName}
              style={styles.input}
            />
            {touched.firstName && errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}

            <TextInput
              mode="outlined"
              label="Last Name"
              value={values.lastName}
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              error={touched.lastName && !!errors.lastName}
              style={styles.input}
            />
            {touched.lastName && errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}

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

            <TextInput
              mode="outlined"
              label="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
              error={touched.password && !!errors.password}
              style={styles.input}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TextInput
              mode="outlined"
              label="Confirm Password"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              secureTextEntry
              error={touched.confirmPassword && !!errors.confirmPassword}
              style={styles.input}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.button}
            >
              Register
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
            >
              Already have an account? Login
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
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

export default RegisterScreen; 