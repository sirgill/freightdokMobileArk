export const colors = {
  // Primary brand colors
  primary: '#0091ff',
  primaryBlue: 'rgb(0, 145, 255)',
  
  // Status colors
  success: '#2DCE89',
  successGreen: 'rgb(40, 167, 69)',
  error: '#F97A5D',
  errorRed: '#ef4444',
  warning: '#E5C000',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  textPrimary: '#000000',
  textSecondary: '#6f6f6f',
  textMuted: '#7d7d7d',
  
  // Background colors
  background: '#F7FAFC',
  cardBackground: '#FFFFFF',
  
  // Border and shadow colors
  border: '#cfcfcf',
  borderLight: '#e0e0e0',
  shadow: 'rgba(34, 35, 58, 0.2)',
  
  // Additional colors from web app
  lightBlue: '#1891FC',
  darkBlue: '#167bff',
  gray: '#adb5bd',
  lightGray: '#fafafa',
} as const;

export type ColorKey = keyof typeof colors; 