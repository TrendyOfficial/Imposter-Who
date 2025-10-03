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

export type GameMode = 
  | 'normal'
  | 'detective'
  | 'everyone-imposter'
  | 'innocents-see-hint'
  | 'roles-switched'
  | 'two-words'
  | 'jester'
  | 'breaking-point'
  | 'healer';

export interface GameSettings {
  theme: 'light' | 'dark';
  language: 'nl';
  gameModes: GameMode[];
  randomizeGameModes: boolean;
  timerEnabled: boolean;
  timerLength: number;
  numberOfImposters: number;
  hintEnabled: boolean;
}

export interface GameState {
  phase: 'lobby' | 'viewing-cards' | 'discussion' | 'voting' | 'results';
  currentPlayerIndex: number;
  selectedWord: string;
  selectedWord2?: string;
  selectedHint: string;
  selectedHint2?: string;
  imposters: string[];
  jesterId?: string;
  detectiveId?: string;
  healerId?: string;
  killedPlayerId?: string;
  activeGameMode: GameMode;
  votes: Record<string, string>;
}
