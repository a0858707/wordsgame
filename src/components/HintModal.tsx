import React from 'react';
import { X, Lightbulb, Search, Eraser, Gift } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  onRevealLetter: () => void;
  onRevealWord: () => void;
  onCheckErrors: () => void;
  onFreeCoins: () => void;
  theme: 'modern' | 'notebook' | 'dark';
  language: 'en' | 'ru';
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  coins,
  onRevealLetter,
  onRevealWord,
  onCheckErrors,
  onFreeCoins,
  theme,
  language,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const isNotebook = theme === 'notebook';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div
        className={`w-full max-w-md rounded-3xl p-6 shadow-2xl relative ${
          isDark
            ? 'bg-slate-900 border border-slate-700 text-white'
            : isNotebook
            ? 'notebook-bg border-3 border-amber-300 text-amber-950'
            : 'bg-white border border-slate-100 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl">
                {language === 'ru' ? 'Подсказки' : 'Game Hints'}
              </h3>
              <p className="text-xs opacity-60">
                {language === 'ru' ? 'Баланс:' : 'Balance:'} {coins} 🪙
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 opacity-70" />
          </button>
        </div>

        {/* Hints List */}
        <div className="flex flex-col gap-3 mb-5">
          {/* Hint 1: Reveal Letter */}
          <button
            onClick={onRevealLetter}
            disabled={coins < 10}
            className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all border ${
              coins >= 10
                ? isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 active:scale-98 cursor-pointer'
                  : 'bg-amber-50/60 hover:bg-amber-100/80 border-amber-200 active:scale-98 cursor-pointer'
                : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/40 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base">
                  {language === 'ru' ? 'Открыть букву' : 'Reveal Letter'}
                </div>
                <div className="text-xs opacity-65">
                  {language === 'ru'
                    ? 'Заполняет эту букву везде в шифре'
                    : 'Uncovers letter in all matching tiles'}
                </div>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-white shrink-0 ml-2">
              10 🪙
            </div>
          </button>

          {/* Hint 2: Solve Active Word */}
          <button
            onClick={onRevealWord}
            disabled={coins < 25}
            className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all border ${
              coins >= 25
                ? isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 active:scale-98 cursor-pointer'
                  : 'bg-indigo-50/60 hover:bg-indigo-100/80 border-indigo-200 active:scale-98 cursor-pointer'
                : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/40 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base">
                  {language === 'ru' ? 'Открыть всё слово' : 'Solve Clue Word'}
                </div>
                <div className="text-xs opacity-65">
                  {language === 'ru'
                    ? 'Полностью раскрывает выбранное слово'
                    : 'Solves the current clue word'}
                </div>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-600 text-white shrink-0 ml-2">
              25 🪙
            </div>
          </button>

          {/* Hint 3: Check & Clean Errors */}
          <button
            onClick={onCheckErrors}
            disabled={coins < 15}
            className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all border ${
              coins >= 15
                ? isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 active:scale-98 cursor-pointer'
                  : 'bg-rose-50/60 hover:bg-rose-100/80 border-rose-200 active:scale-98 cursor-pointer'
                : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/40 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <Eraser className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base">
                  {language === 'ru' ? 'Очистить ошибки' : 'Clear Wrong Letters'}
                </div>
                <div className="text-xs opacity-65">
                  {language === 'ru'
                    ? 'Удаляет все неверные буквы'
                    : 'Erases all incorrect guesses'}
                </div>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500 text-white shrink-0 ml-2">
              15 🪙
            </div>
          </button>
        </div>

        {/* Need more coins? Free bonus chest */}
        <div
          onClick={onFreeCoins}
          className={`w-full p-3 rounded-2xl flex items-center justify-between cursor-pointer border border-dashed transition-all hover:scale-[1.01] ${
            isDark
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : 'bg-amber-100/60 border-amber-400 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <Gift className="w-5 h-5 text-amber-500 animate-bounce" />
            <span>{language === 'ru' ? 'Подарок: +30 монет бесплатно!' : 'Free Bonus: +30 Coins!'}</span>
          </div>
          <span className="text-xs font-extrabold underline">
            {language === 'ru' ? 'Забрать' : 'Claim'}
          </span>
        </div>
      </div>
    </div>
  );
};
