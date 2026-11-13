import React from 'react';
import { Sparkles, Calendar, Grid, PlusCircle, Settings, Award } from 'lucide-react';
import { Puzzle } from '../types';

interface HeaderProps {
  puzzle: Puzzle;
  progressPercentage: number;
  coins: number;
  stars: number;
  streak: number;
  theme: 'modern' | 'notebook' | 'dark';
  onOpenDaily: () => void;
  onOpenLevels: () => void;
  onOpenCustom: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  puzzle,
  progressPercentage,
  coins,
  stars,
  streak,
  theme,
  onOpenDaily,
  onOpenLevels,
  onOpenCustom,
  onOpenSettings,
}) => {
  const isDark = theme === 'dark';
  const isNotebook = theme === 'notebook';

  return (
    <header className={`w-full pt-safe px-3 pb-2 sm:px-4 sm:py-3 transition-colors duration-200 border-b select-none ${
      isDark 
        ? 'bg-slate-900/95 border-slate-800 text-white' 
        : isNotebook
        ? 'bg-[#faf6ee] border-amber-200/80 text-amber-950'
        : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-md shadow-xs'
    }`}>
      {/* Top Status Bar: Branding, Coins, Stars, Tools */}
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Logo & Level Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLevels}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-sm sm:text-base transition-all active:scale-95 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-cyan-400'
                : isNotebook
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-serif'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 shadow-xs'
            }`}
            title="Open Levels Map"
          >
            <Grid className="w-4 h-4" />
            <span className="truncate max-w-[130px] sm:max-w-none">
              {puzzle.id.startsWith('daily') ? '📅 Daily' : `Level ${puzzle.levelNumber}`}
            </span>
          </button>

          {/* Daily Streak Badge */}
          {streak > 0 && (
            <div 
              onClick={onOpenDaily}
              className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-xs font-bold border border-amber-500/20 cursor-pointer hover:bg-amber-500/20 transition-colors"
              title={`${streak} day streak! Click for Daily Challenge`}
            >
              <span>🔥</span>
              <span>{streak}</span>
            </div>
          )}
        </div>

        {/* Center: Progress mini bar (hidden on very small screens, visible on sm+) */}
        <div className="hidden sm:flex flex-col items-center min-w-[160px]">
          <div className="flex items-center justify-between w-full text-xs font-semibold mb-1 opacity-75">
            <span>{puzzle.category || 'Decryption'}</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                progressPercentage === 100 
                  ? 'bg-emerald-500' 
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Right: Coins, Stars & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Coins Badge */}
          <div 
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold shadow-xs ${
              isDark
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-amber-100/80 text-amber-800 border border-amber-300/80'
            }`}
            title="Coins (use for hints!)"
          >
            <span className="text-amber-500">🪙</span>
            <span>{coins}</span>
          </div>

          {/* Stars Badge */}
          <div 
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-bold ${
              isDark ? 'bg-slate-800 text-yellow-400' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}
            title="Total Stars Earned"
          >
            <Award className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
            <span>{stars}</span>
          </div>

          {/* Daily Challenge Button */}
          <button
            onClick={onOpenDaily}
            className={`p-2 rounded-xl transition-all active:scale-90 ${
              isDark
                ? 'hover:bg-slate-800 text-slate-300'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Daily Challenge & Trophy"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
          </button>

          {/* Create Custom Puzzle */}
          <button
            onClick={onOpenCustom}
            className={`p-2 rounded-xl transition-all active:scale-90 ${
              isDark
                ? 'hover:bg-slate-800 text-slate-300'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Create Custom Puzzle"
          >
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
          </button>

          {/* Settings Modal */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-xl transition-all active:scale-90 ${
              isDark
                ? 'hover:bg-slate-800 text-slate-300'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Settings & Themes"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Mobile-only Progress indicator underneath header */}
      <div className="sm:hidden mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs font-semibold">
        <span className="opacity-70 truncate">{puzzle.category}</span>
        <div className="flex items-center gap-2 flex-1 max-w-[180px] ml-2">
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                progressPercentage === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-[10px] tabular-nums font-bold opacity-80">{progressPercentage}%</span>
        </div>
      </div>
    </header>
  );
};
