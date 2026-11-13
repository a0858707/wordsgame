import React from 'react';
import { CipherData } from '../types';
import { isLetter, normalizeLetter } from '../utils/cipher';

interface QuoteBoardProps {
  quote: string;
  guesses: Record<number, string>;
  cipher: CipherData;
  activeNumber: number | null;
  onSelectNumber: (num: number, targetType: 'quote' | 'clue', clueId?: string, index?: number) => void;
  theme: 'modern' | 'notebook' | 'dark';
}

export const QuoteBoard: React.FC<QuoteBoardProps> = ({
  quote,
  guesses,
  cipher,
  activeNumber,
  onSelectNumber,
  theme,
}) => {
  const isDark = theme === 'dark';
  const isNotebook = theme === 'notebook';

  // Split quote into words preserving whitespace & punctuation
  const words = quote.split(' ');

  let globalIndex = 0;

  return (
    <div
      className={`w-full rounded-2xl p-3 sm:p-5 transition-all shadow-sm ${
        isDark
          ? 'bg-slate-800/80 border border-slate-700/80'
          : isNotebook
          ? 'notebook-ruled border-2 border-amber-200/90 shadow-md'
          : 'bg-white/95 border border-slate-200 shadow-sm backdrop-blur-sm'
      }`}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 py-1">
        {words.map((word, wordIdx) => (
          <div key={`word-${wordIdx}`} className="flex items-center gap-1 sm:gap-1.5 flex-nowrap">
            {word.split('').map((char, charIdx) => {
              const currentGlobalIdx = globalIndex++;

              if (!isLetter(char)) {
                // Punctuation (e.g. ',', '.', '!', '-', '?')
                return (
                  <div
                    key={`punc-${wordIdx}-${charIdx}`}
                    className={`flex items-end pb-1.5 px-0.5 font-bold text-lg sm:text-xl ${
                      isDark ? 'text-slate-400' : isNotebook ? 'text-amber-900 handwritten text-2xl' : 'text-slate-500'
                    }`}
                  >
                    {char}
                  </div>
                );
              }

              const normChar = normalizeLetter(char);
              const num = cipher.letterToNumber[normChar] ?? 0;
              const guess = guesses[num];
              const isFilled = Boolean(guess);
              const isCorrect = isFilled && guess.toUpperCase() === normChar;
              const isActive = activeNumber === num;

              return (
                <button
                  key={`tile-${wordIdx}-${charIdx}-${currentGlobalIdx}`}
                  onClick={() => onSelectNumber(num, 'quote', undefined, currentGlobalIdx)}
                  type="button"
                  className={`group relative flex flex-col items-center justify-between rounded-lg sm:rounded-xl transition-all duration-150 cursor-pointer select-none ${
                    // Tile box dimensions: responsive for mobile and desktop
                    'w-7 h-11 sm:w-10 sm:h-14 md:w-11 md:h-15'
                  } ${
                    isActive
                      ? isDark
                        ? 'bg-amber-500/20 border-2 border-amber-400 ring-2 ring-amber-400/40 scale-105 z-10 shadow-lg shadow-amber-500/20'
                        : isNotebook
                        ? 'bg-amber-200 border-2 border-pink-500 ring-2 ring-pink-300 scale-105 z-10 shadow-md'
                        : 'bg-amber-100/90 border-2 border-amber-500 ring-2 ring-amber-400/50 scale-105 z-10 shadow-md'
                      : isFilled
                      ? isDark
                        ? 'bg-slate-700/90 border border-slate-600 hover:border-slate-500'
                        : isNotebook
                        ? 'bg-white/90 border border-amber-300/80 hover:border-amber-400'
                        : 'bg-slate-50 border border-slate-200 hover:border-slate-300'
                      : isDark
                      ? 'bg-slate-800/60 border border-dashed border-slate-600 hover:border-slate-500'
                      : isNotebook
                      ? 'bg-amber-50/60 border border-dashed border-amber-300/70 hover:border-amber-400'
                      : 'bg-white border border-dashed border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {/* Top: Letter Slot */}
                  <div
                    className={`w-full flex-1 flex items-center justify-center font-extrabold text-base sm:text-xl md:text-2xl transition-transform ${
                      isFilled ? 'animate-pop-in' : ''
                    } ${
                      isCorrect
                        ? isDark
                          ? 'text-cyan-300'
                          : isNotebook
                          ? 'text-pink-600 handwritten text-2xl sm:text-3xl'
                          : 'text-indigo-600'
                        : isFilled
                        ? 'text-rose-500'
                        : isDark
                        ? 'text-transparent'
                        : 'text-transparent'
                    }`}
                  >
                    {isFilled ? guess.toUpperCase() : ''}
                  </div>

                  {/* Bottom: Cipher Number */}
                  <div
                    className={`w-full py-0.5 flex items-center justify-center text-[10px] sm:text-xs font-bold border-t ${
                      isActive
                        ? isDark
                          ? 'bg-amber-500/30 text-amber-200 border-amber-400/50 font-black'
                          : isNotebook
                          ? 'bg-pink-100 text-pink-700 border-pink-300 font-black'
                          : 'bg-amber-200/80 text-amber-900 border-amber-300 font-black'
                        : isDark
                        ? 'bg-slate-900/40 text-slate-400 border-slate-700/60'
                        : isNotebook
                        ? 'bg-amber-100/50 text-amber-800 border-amber-200/60'
                        : 'bg-slate-100/80 text-slate-500 border-slate-200'
                    }`}
                  >
                    {num}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
