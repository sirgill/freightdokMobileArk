import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
} as const;

// Export individual theme components
export { colors, typography, spacing };

// Export types
export type { ColorKey } from './colors';
export type { TypographyKey } from './typography';

// Theme type for use in components
export type Theme = typeof theme; 