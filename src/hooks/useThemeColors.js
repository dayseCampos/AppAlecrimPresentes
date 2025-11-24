// src/hooks/useThemeColors.js
import { useColorScheme } from 'react-native';

export function useThemeColors() {
  const scheme = useColorScheme() || 'light';
  const isDark = scheme === 'dark';
  return {
    isDark,
    bg: isDark ? '#0b0f14' : '#ffffff',
    text: isDark ? '#e5e7eb' : '#111827',
    subtext: isDark ? '#9ca3af' : '#6b7280',
    card: isDark ? '#111827' : '#ffffff',
    border: isDark ? '#1f2937' : '#e5e7eb',
    primary: '#111827',
    primaryText: '#ffffff',
    soft: isDark ? '#121826' : '#f3f4f6',
  };
}
