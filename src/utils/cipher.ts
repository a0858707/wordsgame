import { Puzzle, CipherData } from '../types';

export function normalizeLetter(char: string): string {
  return char.toUpperCase();
}

export function isLetter(char: string): boolean {
  // Support English A-Z and Russian А-Я (including Ё)
  return /^[A-ZА-ЯЁ]$/i.test(char);
}

/**
 * Builds a deterministic letter <-> number cipher mapping for a puzzle.
 * If the puzzle provides a customCipher, it respects it; otherwise,
 * it assigns deterministic numbers 1..N based on appearance or seeded shuffle.
 */
export function buildCipher(puzzle: Puzzle): CipherData {
  if (puzzle.customCipher) {
    const letterToNumber: Record<string, number> = {};
    const numberToLetter: Record<number, string> = {};

    for (const [letter, num] of Object.entries(puzzle.customCipher)) {
      const norm = normalizeLetter(letter);
      letterToNumber[norm] = num;
      numberToLetter[num] = norm;
    }

    return {
      letterToNumber,
      numberToLetter,
      totalLetters: Object.keys(letterToNumber).length,
    };
  }

  // Collect all unique letters from the quote and all clue answers
  const uniqueLetters = new Set<string>();

  for (const char of puzzle.quote) {
    if (isLetter(char)) {
      uniqueLetters.add(normalizeLetter(char));
    }
  }

  for (const clue of puzzle.clues) {
    for (const char of clue.answer) {
      if (isLetter(char)) {
        uniqueLetters.add(normalizeLetter(char));
      }
    }
  }

  // Create deterministic assignment using puzzle id as seed
  const lettersArray = Array.from(uniqueLetters).sort();
  
  // Deterministic pseudo-random shuffle so numbers aren't just 1=A, 2=B
  let seed = 0;
  for (let i = 0; i < puzzle.id.length; i++) {
    seed = (seed * 31 + puzzle.id.charCodeAt(i)) >>> 0;
  }

  const shuffled = [...lettersArray];
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const letterToNumber: Record<string, number> = {};
  const numberToLetter: Record<number, string> = {};

  shuffled.forEach((letter, index) => {
    const num = index + 1;
    letterToNumber[letter] = num;
    numberToLetter[num] = letter;
  });

  return {
    letterToNumber,
    numberToLetter,
    totalLetters: shuffled.length,
  };
}

/**
 * Checks if the entire quote has been correctly filled
 */
export function isQuoteCompleted(
  quote: string,
  guesses: Record<number, string>,
  cipher: CipherData
): boolean {
  for (const char of quote) {
    if (isLetter(char)) {
      const norm = normalizeLetter(char);
      const num = cipher.letterToNumber[norm];
      const guess = guesses[num];
      if (!guess || guess.toUpperCase() !== norm) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if a specific clue has been completely solved
 */
export function isClueSolved(
  answer: string,
  guesses: Record<number, string>,
  cipher: CipherData
): boolean {
  for (const char of answer) {
    if (isLetter(char)) {
      const norm = normalizeLetter(char);
      const num = cipher.letterToNumber[norm];
      const guess = guesses[num];
      if (!guess || guess.toUpperCase() !== norm) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Computes how many total letters in the quote are correctly guessed
 */
export function getQuoteProgress(
  quote: string,
  guesses: Record<number, string>,
  cipher: CipherData
): { current: number; total: number; percentage: number } {
  let total = 0;
  let current = 0;

  for (const char of quote) {
    if (isLetter(char)) {
      total++;
      const norm = normalizeLetter(char);
      const num = cipher.letterToNumber[norm];
      const guess = guesses[num];
      if (guess && guess.toUpperCase() === norm) {
        current++;
      }
    }
  }

  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  return { current, total, percentage };
}
