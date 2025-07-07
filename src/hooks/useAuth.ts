import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../store';
import { setUser, setLoading, setError, logout } from '../store/slices/authSlice';
import { authApi } from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      console.log('useAuth: Starting login...');
      const response = await authApi.login(email, password);
      console.log('useAuth: Login response received:', response);

      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', response.token);
      console.log('useAuth: Token stored in AsyncStorage');

      dispatch(setUser({ user: response.user, token: response.token }));
      dispatch(setError(null));
      console.log('useAuth: Login successful, user and token set in Redux');
    } catch (err) {
      console.error('useAuth: Login error:', err);
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const register = useCallback(async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.register(userData);
      await AsyncStorage.setItem('token', response.token);
      dispatch(setUser({ user: response.user, token: response.token }));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('token');
      dispatch(logout());
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    }
  }, [dispatch]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      dispatch(setLoading(true));
      await authApi.forgotPassword(email);
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      dispatch(setLoading(true));
      await authApi.resetPassword(token, password);
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout: handleLogout,
    forgotPassword,
    resetPassword,
  };
};
