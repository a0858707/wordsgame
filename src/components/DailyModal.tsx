import React from 'react';
import { X, Calendar, Trophy, Flame, Play, CheckCircle } from 'lucide-react';
import { Puzzle } from '../types';

interface DailyModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyPuzzle: Puzzle;
  isCompletedToday: boolean;
  streak: number;
  onPlayDaily: () => void;
  theme: 'modern' | 'notebook' | 'dark';
  language: 'en' | 'ru';
}

export const DailyModal: React.FC<DailyModalProps> = ({
  isOpen,
  onClose,
  dailyPuzzle,
  isCompletedToday,
  streak,
  onPlayDaily,
  theme,
  language,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const isNotebook = theme === 'notebook';

  const today = new Date();
  const dateFormatted = today.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl relative text-center ${
          isDark
            ? 'bg-slate-900 border border-slate-700 text-white'
            : isNotebook
            ? 'notebook-bg border-3 border-amber-300 text-amber-950'
            : 'bg-white border border-slate-100 text-slate-800'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5 opacity-70" />
        </button>

        {/* Calendar Badge */}
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center mb-3">
          <Calendar className="w-8 h-8" />
        </div>

        <h3 className="font-black text-2xl mb-1">
          {language === 'ru' ? 'Ежедневный вызов' : 'Daily Challenge'}
        </h3>
        <p className="text-xs sm:text-sm font-semibold opacity-70 capitalize mb-5">
          {dateFormatted}
        </p>

        {/* Streak & Trophy Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div
            className={`p-3.5 rounded-2xl flex flex-col items-center border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-xl sm:text-2xl mb-0.5">
              <Flame className="w-6 h-6 fill-amber-500" />
              <span>{streak}</span>
            </div>
            <span className="text-[11px] font-bold opacity-70">
              {language === 'ru' ? 'Дней подряд' : 'Day Streak'}
            </span>
          </div>

          <div
            className={`p-3.5 rounded-2xl flex flex-col items-center border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-indigo-50/70 border-indigo-200'
            }`}
          >
            <div className="flex items-center gap-1.5 text-indigo-500 font-extrabold text-xl sm:text-2xl mb-0.5">
              <Trophy className="w-6 h-6" />
              <span>{isCompletedToday ? '1/1' : '0/1'}</span>
            </div>
            <span className="text-[11px] font-bold opacity-70">
              {language === 'ru' ? 'Сегодняшний трофей' : 'Today Trophy'}
            </span>
          </div>
        </div>

        {/* Daily Bonus Details */}
        <div
          className={`p-3.5 rounded-2xl mb-6 text-left flex items-center justify-between text-xs sm:text-sm font-bold border ${
            isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span>{language === 'ru' ? 'Награда за победу:' : 'Victory Reward:'}</span>
          <span className="text-amber-500 font-black">+50 🪙 & 🏆 Trophy</span>
        </div>

        {/* Play Button */}
        <button
          onClick={() => {
            onPlayDaily();
            onClose();
          }}
          className={`w-full py-3.5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all ${
            isCompletedToday
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white shadow-indigo-500/25 hover:opacity-95'
          }`}
        >
          {isCompletedToday ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>{language === 'ru' ? 'Пройдено (Играть снова)' : 'Completed (Replay)'}</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{language === 'ru' ? 'Начать испытание' : 'Start Challenge'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
