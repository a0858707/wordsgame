import React from 'react';
import { X, Star, CheckCircle, Lock, Play } from 'lucide-react';
import { Puzzle, LevelProgress, Language } from '../types';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  puzzles: Puzzle[];
  currentPuzzleId: string;
  progressMap: Record<string, LevelProgress>;
  language: Language;
  onSelectLevel: (puzzle: Puzzle) => void;
  onLanguageChange: (lang: Language) => void;
  theme: 'modern' | 'notebook' | 'dark';
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  puzzles,
  currentPuzzleId,
  progressMap,
  language,
  onSelectLevel,
  onLanguageChange,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const isNotebook = theme === 'notebook';

  const filteredPuzzles = puzzles.filter((p) => p.language === language && !p.id.startsWith('daily'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div
        className={`w-full max-w-xl max-h-[85vh] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col relative ${
          isDark
            ? 'bg-slate-900 border border-slate-700 text-white'
            : isNotebook
            ? 'notebook-bg border-3 border-amber-300 text-amber-950'
            : 'bg-white border border-slate-100 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-xl sm:text-2xl">Select Level</h3>
            <p className="text-xs opacity-60">Crostic Puzzles Library</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 opacity-70" />
          </button>
        </div>

        {/* Language switcher tabs */}
        <div className="flex gap-2 my-4">
          <button
            onClick={() => onLanguageChange('en')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              language === 'en'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            🇬🇧 English Puzzles
          </button>
          <button
            onClick={() => onLanguageChange('ru')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              language === 'ru'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            🇷🇺 Russian Pack
          </button>
        </div>

        {/* Puzzles List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
          {filteredPuzzles.map((p) => {
            const prog = progressMap[p.id];
            const isSolved = prog?.solved;
            const stars = prog?.stars || 0;
            const isCurrent = p.id === currentPuzzleId;

            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectLevel(p);
                  onClose();
                }}
                className={`w-full p-3.5 sm:p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-150 border active:scale-98 ${
                  isCurrent
                    ? 'border-2 border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30'
                    : isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700'
                    : isNotebook
                    ? 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-200'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${
                      isSolved
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-indigo-600 text-white'
                        : isDark
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-white text-slate-700 border border-slate-200 shadow-xs'
                    }`}
                  >
                    {isSolved ? <CheckCircle className="w-5 h-5 stroke-[2.5]" /> : p.levelNumber}
                  </div>

                  <div className="text-left">
                    <div className="font-extrabold text-sm sm:text-base leading-tight flex items-center gap-2">
                      <span>{p.title}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs opacity-60 mt-0.5">
                      {p.category} • {p.clues.length} words
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= stars
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
