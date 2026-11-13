import React from 'react';
import { Check, HelpCircle } from 'lucide-react';
import { ClueItem, CipherData } from '../types';
import { isClueSolved, isLetter, normalizeLetter } from '../utils/cipher';

interface CluesListProps {
  clues: ClueItem[];
  guesses: Record<number, string>;
  cipher: CipherData;
  activeClueId: string | null;
  activeTileIndex: number;
  activeNumber: number | null;
  onSelectTile: (clueId: string, index: number, num: number) => void;
  theme: 'modern' | 'notebook' | 'dark';
}

export const CluesList: React.FC<CluesListProps> = ({
  clues,
  guesses,
  cipher,
  activeClueId,
  activeTileIndex,
  activeNumber,
  onSelectTile,
  theme,
}) => {
  const isDark = theme === 'dark';
  const isNotebook = theme === 'notebook';

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Section Header Banner like the screenshot: DEFINITIONS: CLUES AND WORDS */}
      <div
        className={`w-full py-1.5 px-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold uppercase tracking-wider ${
          isDark
            ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/40'
            : isNotebook
            ? 'bg-amber-100 text-amber-900 border border-amber-300'
            : 'bg-cyan-500/10 text-cyan-800 border border-cyan-200'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span>📝</span>
          <span>Definitions: Clues & Words</span>
        </span>
        <span className="opacity-70 text-[11px] normal-case tracking-normal">
          Tap any tile to type
        </span>
      </div>

      {/* Clues Items List */}
      <div className="flex flex-col gap-2">
        {clues.map((item, clueIdx) => {
          const solved = isClueSolved(item.answer, guesses, cipher);
          const isRowActive = activeClueId === item.id;

          return (
            <div
              key={item.id}
              className={`w-full p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                solved
                  ? isDark
                    ? 'bg-emerald-950/20 border border-emerald-800/40 opacity-90'
                    : isNotebook
                    ? 'bg-emerald-50/60 border border-emerald-200/90'
                    : 'bg-emerald-50/70 border border-emerald-200/80'
                  : isRowActive
                  ? isDark
                    ? 'bg-slate-800/90 border border-cyan-500/50 shadow-sm'
                    : isNotebook
                    ? 'bg-amber-50 border-2 border-pink-400 shadow-sm'
                    : 'bg-white border-2 border-indigo-400 shadow-sm'
                  : isDark
                  ? 'bg-slate-800/50 border border-slate-700/60 hover:bg-slate-800/80'
                  : isNotebook
                  ? 'bg-white/90 border border-amber-200 hover:border-amber-300'
                  : 'bg-white border border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Left Clue Info: Icon, Number/Index, Text */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {/* Icon or Clue Number */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm sm:text-base shrink-0 ${
                    solved
                      ? 'bg-emerald-500 text-white font-bold'
                      : isDark
                      ? 'bg-slate-700 text-slate-200'
                      : isNotebook
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-indigo-50 text-indigo-700 font-bold'
                  }`}
                >
                  {solved ? <Check className="w-4 h-4 stroke-[3]" /> : item.icon || `${clueIdx + 1}`}
                </div>

                {/* Definition text */}
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs sm:text-sm font-semibold leading-tight line-clamp-2 ${
                      solved
                        ? isDark
                          ? 'text-emerald-300/80 line-through'
                          : 'text-emerald-800/80 line-through'
                        : isDark
                        ? 'text-slate-100'
                        : isNotebook
                        ? 'text-amber-950 font-serif'
                        : 'text-slate-800'
                    }`}
                  >
                    {item.clue}
                  </span>
                  {item.category && (
                    <span className="text-[10px] font-medium opacity-60">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Answer Letter Tiles */}
              <div className="flex items-center gap-1 sm:gap-1.5 self-end sm:self-center shrink-0">
                {item.answer.split('').map((char, charIdx) => {
                  if (!isLetter(char)) {
                    return (
                      <span key={`punc-${charIdx}`} className="font-bold px-1 text-slate-500">
                        {char}
                      </span>
                    );
                  }

                  const normChar = normalizeLetter(char);
                  const num = cipher.letterToNumber[normChar] ?? 0;
                  const guess = guesses[num];
                  const isFilled = Boolean(guess);
                  const isCorrect = isFilled && guess.toUpperCase() === normChar;
                  const isTileSelected = activeClueId === item.id && activeTileIndex === charIdx;
                  const isNumberMatching = activeNumber === num;

                  return (
                    <button
                      key={`clue-tile-${item.id}-${charIdx}`}
                      onClick={() => onSelectTile(item.id, charIdx, num)}
                      type="button"
                      className={`relative flex flex-col items-center justify-between rounded-md sm:rounded-lg transition-all duration-150 cursor-pointer select-none ${
                        'w-7 h-10 sm:w-9 sm:h-12'
                      } ${
                        isTileSelected
                          ? isDark
                            ? 'bg-amber-500/20 border-2 border-amber-400 ring-2 ring-amber-400/40 scale-105 z-10 shadow-md'
                            : isNotebook
                            ? 'bg-amber-200 border-2 border-pink-500 ring-2 ring-pink-300 scale-105 z-10 shadow-sm'
                            : 'bg-amber-100/90 border-2 border-amber-500 ring-2 ring-amber-400/50 scale-105 z-10 shadow-sm'
                          : isNumberMatching
                          ? isDark
                            ? 'bg-amber-500/10 border border-amber-400 ring-1 ring-amber-400/30'
                            : isNotebook
                            ? 'bg-pink-100/80 border border-pink-400'
                            : 'bg-amber-50 border border-amber-400'
                          : solved
                          ? isDark
                            ? 'bg-emerald-900/40 border border-emerald-700/60'
                            : isNotebook
                            ? 'bg-emerald-100/80 border border-emerald-300'
                            : 'bg-emerald-100/70 border border-emerald-300'
                          : isFilled
                          ? isDark
                            ? 'bg-slate-700 border border-slate-600'
                            : 'bg-slate-100 border border-slate-300'
                          : isDark
                          ? 'bg-slate-800/80 border border-dashed border-slate-600'
                          : 'bg-white border border-dashed border-slate-300'
                      }`}
                    >
                      {/* Letter */}
                      <div
                        className={`w-full flex-1 flex items-center justify-center font-extrabold text-sm sm:text-lg ${
                          isFilled ? 'animate-pop-in' : ''
                        } ${
                          solved
                            ? isDark
                              ? 'text-emerald-300'
                              : 'text-emerald-700'
                            : isCorrect
                            ? isDark
                              ? 'text-cyan-300'
                              : isNotebook
                              ? 'text-pink-600 handwritten text-xl'
                              : 'text-indigo-600'
                            : isFilled
                            ? 'text-rose-500'
                            : 'text-transparent'
                        }`}
                      >
                        {isFilled ? guess.toUpperCase() : ''}
                      </div>

                      {/* Number */}
                      <div
                        className={`w-full py-0.5 flex items-center justify-center text-[9px] sm:text-[10px] font-bold border-t ${
                          isNumberMatching
                            ? isDark
                              ? 'bg-amber-500/30 text-amber-200 border-amber-400/50 font-black'
                              : isNotebook
                              ? 'bg-pink-200 text-pink-800 border-pink-300 font-black'
                              : 'bg-amber-200 text-amber-900 border-amber-400 font-black'
                            : isDark
                            ? 'bg-slate-900/50 text-slate-400 border-slate-700'
                            : isNotebook
                            ? 'bg-amber-100/60 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {num}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
