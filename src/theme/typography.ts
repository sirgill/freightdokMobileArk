export const typography = {
  // Font families (we'll use system fonts for mobile, but keep the structure)
  fontFamily: {
    light: 'System',
    regular: 'System',
    bold: 'System',
    extraBold: 'System',
  },
  
  // Font sizes matching web app
  fontSize: {
    xs: 12,
    small: 14,
    body: 16,
    title: 22,
    heading: 32,
    large: 56,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
    extraBold: '900',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  // Text styles for common use cases
  textStyles: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 22,
      fontWeight: '700',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.4,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.2,
    },
  },
} as const;

export type TypographyKey = keyof typeof typography.textStyles; 