import { DefaultTheme } from 'react-native-paper';

export const colors = {
  primary: {
    main: '#1A73E8',
    light: '#4285F4',
    dark: '#0D47A1',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#34A853',
    light: '#4CAF50',
    dark: '#2E7D32',
    contrast: '#FFFFFF',
  },
  neutral: {
    100: '#FFFFFF',
    200: '#F5F5F5',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#B71C1C',
  },
  warning: {
    main: '#FFA000',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  success: {
    main: '#388E3C',
    light: '#66BB6A',
    dark: '#2E7D32',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
};

export const shadows = {
  small: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary.main,
    accent: colors.secondary.main,
    background: colors.neutral[100],
    surface: colors.neutral[100],
    error: colors.error.main,
    text: colors.neutral[900],
    disabled: colors.neutral[400],
    placeholder: colors.neutral[500],
    backdrop: colors.neutral[900],
  },
  spacing,
  typography,
  shadows,
};
