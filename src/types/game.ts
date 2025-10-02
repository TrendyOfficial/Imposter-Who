export interface Player {
  id: string;
  name: string;
  color: string;
  isImposter?: boolean;
}

export interface Word {
  word: string;
  hint: string;
}

export interface Category {
  name: string;
  emoji: string;
  words: Word[];
  isDefault?: boolean;
}

export interface GameSettings {
  theme: 'light' | 'dark';
  language: 'nl';
  trollMode: boolean;
  timerEnabled: boolean;
  timerLength: number;
  numberOfImposters: number;
  hintEnabled: boolean;
}

export interface GameState {
  phase: 'lobby' | 'viewing-cards' | 'discussion' | 'voting' | 'results';
  currentPlayerIndex: number;
  selectedWord: string;
  selectedHint: string;
  imposters: string[];
  votes: Record<string, string>;
}
