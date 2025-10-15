import { useEffect } from 'react';
import { ThemeName, themePresets } from '@/types/theme';

export const useThemeAdaptation = (themeName: ThemeName, enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;
    
    const theme = themePresets[themeName] || themePresets['default'];
    const root = document.documentElement;

    // Apply theme-adapted button colors
    root.style.setProperty('--button-primary', theme.primary);
    root.style.setProperty('--button-primary-glow', theme.primaryGlow);
    root.style.setProperty('--button-accent', theme.accent);
  }, [themeName, enabled]);

  useEffect(() => {
    if (!enabled) {
      const root = document.documentElement;
      root.style.removeProperty('--button-primary');
      root.style.removeProperty('--button-primary-glow');
      root.style.removeProperty('--button-accent');
    }
  }, [enabled]);
};
