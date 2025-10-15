export type ThemeName = 
  | 'default'
  | 'classic'
  | 'grape'
  | 'spiderman'
  | 'ember'
  | 'wolverine'
  | 'acid'
  | 'spark'
  | 'hulk'
  | 'popsicle'
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
    primary: '180 70% 50%',
    primaryGlow: '180 75% 60%',
    accent: '190 70% 55%',
    light: {
      background: '180 15% 98%',
      foreground: '180 25% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(180 15% 98%), hsl(185 20% 95%))',
    },
    dark: {
      background: '180 25% 8%',
      foreground: '180 15% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(180 25% 8%), hsl(185 20% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(180 70% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  classic: {
    primary: '265 60% 55%',
    primaryGlow: '265 70% 65%',
    accent: '280 70% 60%',
    light: {
      background: '260 15% 98%',
      foreground: '260 25% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(260 15% 98%), hsl(265 20% 95%))',
    },
    dark: {
      background: '260 25% 8%',
      foreground: '260 15% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(260 25% 8%), hsl(265 20% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(265 60% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  grape: {
    primary: '265 60% 55%',
    primaryGlow: '265 70% 65%',
    accent: '280 70% 60%',
    light: {
      background: '265 20% 98%',
      foreground: '265 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(265 20% 98%), hsl(270 25% 95%))',
    },
    dark: {
      background: '265 30% 8%',
      foreground: '265 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(265 30% 8%), hsl(270 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(265 60% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  spiderman: {
    primary: '220 70% 55%',
    primaryGlow: '220 75% 65%',
    accent: '0 70% 60%',
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
  ember: {
    primary: '0 70% 55%',
    primaryGlow: '0 75% 65%',
    accent: '10 70% 60%',
    light: {
      background: '0 20% 98%',
      foreground: '0 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(0 20% 98%), hsl(5 25% 95%))',
    },
    dark: {
      background: '0 30% 5%',
      foreground: '0 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(0 30% 5%), hsl(5 25% 8%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(0 70% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  wolverine: {
    primary: '45 70% 50%',
    primaryGlow: '45 75% 60%',
    accent: '220 70% 55%',
    light: {
      background: '45 20% 98%',
      foreground: '45 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(45 20% 98%), hsl(45 25% 95%))',
    },
    dark: {
      background: '220 30% 8%',
      foreground: '45 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(220 30% 8%), hsl(220 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(45 70% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  acid: {
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
  spark: {
    primary: '45 70% 50%',
    primaryGlow: '45 75% 60%',
    accent: '55 70% 55%',
    light: {
      background: '45 20% 98%',
      foreground: '45 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(45 20% 98%), hsl(50 25% 95%))',
    },
    dark: {
      background: '45 30% 8%',
      foreground: '45 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(45 30% 8%), hsl(50 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(45 70% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  hulk: {
    primary: '280 65% 55%',
    primaryGlow: '280 70% 65%',
    accent: '140 65% 50%',
    light: {
      background: '280 20% 98%',
      foreground: '280 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(280 20% 98%), hsl(285 25% 95%))',
    },
    dark: {
      background: '280 30% 8%',
      foreground: '280 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(280 30% 8%), hsl(285 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(280 65% 25% / 0.3) 0%, transparent 60%)',
    },
  },
  popsicle: {
    primary: '200 70% 50%',
    primaryGlow: '200 75% 60%',
    accent: '30 70% 55%',
    light: {
      background: '200 20% 98%',
      foreground: '200 30% 12%',
      gradientBg: 'linear-gradient(180deg, hsl(200 20% 98%), hsl(205 25% 95%))',
    },
    dark: {
      background: '200 30% 8%',
      foreground: '200 20% 98%',
      gradientBg: 'linear-gradient(180deg, hsl(200 30% 8%), hsl(205 25% 10%))',
      ambientGlow: 'radial-gradient(ellipse at top, hsl(200 70% 25% / 0.3) 0%, transparent 60%)',
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
