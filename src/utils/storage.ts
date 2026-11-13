import { GameSettings, LevelProgress } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'crostic_settings',
  COINS: 'crostic_coins',
  PROGRESS: 'crostic_progress',
  DAILY: 'crostic_daily',
  ACTIVE_LEVEL: 'crostic_active_level',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'modern',
  highlightMatchingNumbers: true,
  autoAdvance: true,
  language: 'en',
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // fallback
  }
}

export function loadCoins(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COINS);
    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return 60; // Starting bonus coins
}

export function saveCoins(coins: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COINS, coins.toString());
  } catch {
    // fallback
  }
}

export function loadAllProgress(): Record<string, LevelProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {};
}

export function saveLevelProgress(levelId: string, progress: LevelProgress): void {
  try {
    const all = loadAllProgress();
    all[levelId] = progress;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(all));
  } catch {
    // fallback
  }
}

export function loadActiveLevelId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_LEVEL);
  } catch {
    return null;
  }
}

export function saveActiveLevelId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_LEVEL, id);
  } catch {
    // fallback
  }
}
