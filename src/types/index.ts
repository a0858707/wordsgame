export type Language = 'en' | 'ru';

export interface ClueItem {
  id: string;
  clue: string;
  answer: string;
  category?: string;
  icon?: string; // Emoji or icon name
}

export interface Puzzle {
  id: string;
  levelNumber: number;
  title: string;
  category?: string;
  quote: string; // The secret phrase / quote
  author?: string;
  source?: string;
  fact: string; // The fascinating fact revealed upon victory
  difficulty: 'easy' | 'medium' | 'hard';
  language: Language;
  clues: ClueItem[];
  // If pre-defined cipher map is omitted, our cipher engine generates it automatically!
  customCipher?: Record<string, number>;
}

export interface CipherData {
  letterToNumber: Record<string, number>;
  numberToLetter: Record<number, string>;
  totalLetters: number;
}

export interface TilePosition {
  type: 'quote' | 'clue';
  clueId?: string;
  index: number;
  letter: string;
  number: number;
}

export interface LevelProgress {
  solved: boolean;
  stars: number; // 0 to 3
  timeSpent: number; // in seconds
  score: number;
  guesses: Record<number, string>; // number -> entered letter
  hintsUsed: number;
  completedAt?: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'modern' | 'notebook' | 'dark';
  highlightMatchingNumbers: boolean;
  autoAdvance: boolean;
  language: Language;
}

export interface DailyChallengeInfo {
  dateString: string; // YYYY-MM-DD
  puzzleId: string;
  completed: boolean;
  streak: number;
}
