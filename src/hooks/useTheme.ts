import { useEffect } from 'react';
import { ThemeName, themePresets } from '@/types/theme';

export const useTheme = (themeName: ThemeName, mode: 'light' | 'dark') => {
  useEffect(() => {
    const theme = themePresets[themeName];
    const root = document.documentElement;

    // Set primary colors (same for both modes)
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-glow', theme.primaryGlow);
    root.style.setProperty('--accent', theme.accent);

    // Set mode-specific colors
    if (mode === 'dark') {
      root.style.setProperty('--background', theme.dark.background);
      root.style.setProperty('--foreground', theme.dark.foreground);
      root.style.setProperty('--gradient-bg', theme.dark.gradientBg);
      root.style.setProperty('--ambient-glow', theme.dark.ambientGlow);
      root.classList.add('dark');
    } else {
      root.style.setProperty('--background', theme.light.background);
      root.style.setProperty('--foreground', theme.light.foreground);
      root.style.setProperty('--gradient-bg', theme.light.gradientBg);
      root.style.setProperty('--ambient-glow', 'none');
      root.classList.remove('dark');
    }
  }, [themeName, mode]);
};
