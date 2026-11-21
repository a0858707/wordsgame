import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, Share2, Sparkles, BookOpen } from 'lucide-react';
import { Puzzle } from '../types';

interface WinModalProps {
  puzzle: Puzzle;
  stars: number;
  coinsEarned: number;
  timeSpent: number;
  onNextLevel: () => void;
  onClose: () => void;
  theme: 'modern' | 'notebook' | 'dark';
}

export const WinModal: React.FC<WinModalProps> = ({
  puzzle,
  stars,
  coinsEarned,
  timeSpent,
  onNextLevel,
  onClose,
  theme,
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst!
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const isDark = theme === 'dark';
  const isNotebook = theme === 'notebook';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden ${
          isDark
            ? 'bg-slate-900 border border-slate-700 text-white'
            : isNotebook
            ? 'notebook-bg border-4 border-amber-300 text-amber-950'
            : 'bg-white border border-slate-100 text-slate-800'
        }`}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600" />

        {/* Trophy & Stars Header */}
        <div className="relative mt-2 mb-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-400/20 rounded-full flex items-center justify-center ring-8 ring-amber-400/10">
            <Trophy className="w-9 h-9 sm:w-11 sm:h-11 text-amber-500 animate-bounce" />
          </div>
          <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
          Mystery Solved!
        </h2>
        <p className="text-xs sm:text-sm font-semibold opacity-70 mb-4">
          {puzzle.category} • {formatTime(timeSpent)}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-7 h-7 sm:w-9 sm:h-9 transition-transform ${
                starIdx <= stars
                  ? 'fill-amber-400 text-amber-500 scale-110'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Solved Secret Quote Box */}
        <div
          className={`w-full p-4 rounded-2xl mb-4 text-left border ${
            isDark
              ? 'bg-slate-800/80 border-slate-700'
              : isNotebook
              ? 'bg-amber-100/60 border-amber-300 handwritten'
              : 'bg-indigo-50/60 border-indigo-100'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-cyan-400 mb-1">
            Decoded Phrase:
          </div>
          <p className="text-lg sm:text-xl font-black tracking-wide leading-relaxed text-indigo-950 dark:text-white">
            "{puzzle.quote}"
          </p>
          {puzzle.author && (
            <p className="text-xs sm:text-sm font-semibold text-right mt-1 opacity-75">
              — {puzzle.author}
            </p>
          )}
        </div>

        {/* Fascinating Fact (The Crostic signature feature!) */}
        {puzzle.fact && (
          <div
            className={`w-full p-3.5 sm:p-4 rounded-2xl mb-5 text-left flex items-start gap-3 border ${
              isDark
                ? 'bg-cyan-950/20 border-cyan-800/40 text-cyan-200'
                : 'bg-amber-50 border-amber-200/80 text-amber-900'
            }`}
          >
            <BookOpen className="w-5 h-5 shrink-0 text-amber-600 dark:text-cyan-400 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-bold block mb-0.5">Fascinating Fact:</span>
              {puzzle.fact}
            </div>
          </div>
        )}

        {/* Reward Coins */}
        <div className="flex items-center gap-2 mb-6 font-extrabold text-sm sm:text-base">
          <span>Reward:</span>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded-full border border-amber-500/30 flex items-center gap-1.5">
            <span>🪙</span>
            <span>+{coinsEarned} coins</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-3">
          <button
            onClick={onNextLevel}
            className="flex-1 py-3.5 px-6 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Next Level</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
