export type ThemeName = 
  | 'default'
  | 'classic'
  | 'blue'
  | 'teal'
  | 'red'
  | 'gray'
  | 'green'
  | 'forest'
  | 'autumn'
  | 'mocha'
  | 'pink'
  | 'noir';

export interface ThemeColors {
  primary: string;
  primaryGlow: string;
  accent: string;
  // Light mode
  light: {
    background: string;
    foreground: string;
    gradientBg: string;
  };
  // Dark mode
  dark: {
    background: string;
    foreground: string;
    gradientBg: string;
    ambientGlow: string;
  };
}

export const themePresets: Record<ThemeName, ThemeColors> = {
  default: {
    primary: '265 60% 55%',
    primaryGlow: '265 70% 65%',
    accent: '280 70% 60%',
    light: {
      background: '240 20% 98%',
      foreground: '260 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(240 20% 98%), hsl(250 25% 95%))',
    },
    dark: {
      background: '260 30% 8%',
      foreground: '240 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(260 30% 8%), hsl(265 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(265 60% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  classic: {
    primary: '160 70% 45%',
    primaryGlow: '160 70% 55%',
    accent: '180 60% 50%',
    light: {
      background: '150 20% 98%',
      foreground: '160 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(150 20% 98%), hsl(160 25% 95%))',
    },
    dark: {
      background: '160 30% 8%',
      foreground: '150 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(160 30% 8%), hsl(165 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(160 70% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  blue: {
    primary: '220 70% 55%',
    primaryGlow: '220 75% 65%',
    accent: '210 70% 60%',
    light: {
      background: '220 20% 98%',
      foreground: '220 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(220 20% 98%), hsl(220 25% 95%))',
    },
    dark: {
      background: '220 30% 8%',
      foreground: '220 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(220 30% 8%), hsl(220 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(220 70% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  teal: {
    primary: '180 65% 50%',
    primaryGlow: '180 70% 60%',
    accent: '190 65% 55%',
    light: {
      background: '180 20% 98%',
      foreground: '180 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(180 20% 98%), hsl(185 25% 95%))',
    },
    dark: {
      background: '180 30% 8%',
      foreground: '180 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(180 30% 8%), hsl(185 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(180 65% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  red: {
    primary: '0 70% 55%',
    primaryGlow: '0 75% 65%',
    accent: '10 70% 60%',
    light: {
      background: '0 20% 98%',
      foreground: '0 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(0 20% 98%), hsl(5 25% 95%))',
    },
    dark: {
      background: '0 30% 8%',
      foreground: '0 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(0 30% 8%), hsl(5 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(0 70% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  gray: {
    primary: '210 10% 45%',
    primaryGlow: '210 15% 55%',
    accent: '220 10% 50%',
    light: {
      background: '210 10% 98%',
      foreground: '210 20% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(210 10% 98%), hsl(210 15% 95%))',
    },
    dark: {
      background: '210 15% 8%',
      foreground: '210 10% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(210 15% 8%), hsl(210 12% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(210 10% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  green: {
    primary: '140 65% 50%',
    primaryGlow: '140 70% 60%',
    accent: '150 65% 55%',
    light: {
      background: '140 20% 98%',
      foreground: '140 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(140 20% 98%), hsl(145 25% 95%))',
    },
    dark: {
      background: '140 30% 8%',
      foreground: '140 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(140 30% 8%), hsl(145 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(140 65% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  forest: {
    primary: '155 50% 35%',
    primaryGlow: '155 55% 45%',
    accent: '165 50% 40%',
    light: {
      background: '155 15% 98%',
      foreground: '155 40% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(155 15% 98%), hsl(160 20% 95%))',
    },
    dark: {
      background: '155 35% 8%',
      foreground: '155 15% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(155 35% 8%), hsl(160 30% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(155 50% 20% / 0.3) 0%, transparent 60%)',
    },
  },
  autumn: {
    primary: '30 70% 50%',
    primaryGlow: '30 75% 60%',
    accent: '20 70% 55%',
    light: {
      background: '30 20% 98%',
      foreground: '30 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(30 20% 98%), hsl(25 25% 95%))',
    },
    dark: {
      background: '30 30% 8%',
      foreground: '30 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(30 30% 8%), hsl(25 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(30 70% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  mocha: {
    primary: '25 45% 40%',
    primaryGlow: '25 50% 50%',
    accent: '30 45% 45%',
    light: {
      background: '25 15% 98%',
      foreground: '25 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(25 15% 98%), hsl(25 20% 95%))',
    },
    dark: {
      background: '25 25% 8%',
      foreground: '25 15% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(25 25% 8%), hsl(25 20% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(25 45% 20% / 0.3) 0%, transparent 60%)',
    },
  },
  pink: {
    primary: '330 70% 55%',
    primaryGlow: '330 75% 65%',
    accent: '340 70% 60%',
    light: {
      background: '330 20% 98%',
      foreground: '330 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(330 20% 98%), hsl(335 25% 95%))',
    },
    dark: {
      background: '330 30% 8%',
      foreground: '330 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(330 30% 8%), hsl(335 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(330 70% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  noir: {
    primary: '0 0% 20%',
    primaryGlow: '0 0% 30%',
    accent: '0 0% 25%',
    light: {
      background: '0 0% 98%',
      foreground: '0 0% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(0 0% 98%), hsl(0 0% 95%))',
    },
    dark: {
      background: '0 0% 5%',
      foreground: '0 0% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(0 0% 5%), hsl(0 0% 8%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(0 0% 15% / 0.3) 0%, transparent 60%)',
    },
  },
};
