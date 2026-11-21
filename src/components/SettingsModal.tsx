import React from 'react';
import { X, Volume2, VolumeX, Smartphone, Palette, Globe, RotateCcw } from 'lucide-react';
import { GameSettings, Language } from '../types';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const isDark = settings.theme === 'dark';
  const isNotebook = settings.theme === 'notebook';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl relative ${
          isDark
            ? 'bg-slate-900 border border-slate-700 text-white'
            : isNotebook
            ? 'notebook-bg border-3 border-amber-300 text-amber-950'
            : 'bg-white border border-slate-100 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <h3 className="font-extrabold text-xl sm:text-2xl">Settings</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 opacity-70" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Theme Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 opacity-80">
              <Palette className="w-4 h-4" />
              <span>Game Theme</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'modern' })}
                className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center gap-1 border transition-all ${
                  settings.theme === 'modern'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-black shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                }`}
              >
                <span>📱 Modern</span>
                <span className="text-[10px] opacity-60">Clean App</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'notebook' })}
                className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center gap-1 border transition-all ${
                  settings.theme === 'notebook'
                    ? 'border-amber-600 bg-amber-100 text-amber-900 font-black shadow-xs ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                }`}
              >
                <span>📝 Notebook</span>
                <span className="text-[10px] opacity-60">Handwritten</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'dark' })}
                className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center gap-1 border transition-all ${
                  settings.theme === 'dark'
                    ? 'border-cyan-500 bg-slate-800 text-cyan-300 font-black shadow-xs ring-2 ring-cyan-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                }`}
              >
                <span>🌙 Midnight</span>
                <span className="text-[10px] opacity-60">Dark Neon</span>
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 opacity-80">
              <Globe className="w-4 h-4" />
              <span>Puzzle Language</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                  settings.language === 'en'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ language: 'ru' })}
                className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                  settings.language === 'ru'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                🇷🇺 Russian
              </button>
            </div>
          </div>

          {/* Sound & Haptics Toggles */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-2 rounded-xl">
              <div className="flex items-center gap-2.5">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                ) : (
                  <VolumeX className="w-5 h-5 opacity-50" />
                )}
                <span className="text-sm font-bold">Sound Effects</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.unlockAudio();
                    sound.playVictoryFanfare();
                    sound.hapticSuccess();
                  }}
                  className="text-[11px] font-bold px-2 py-1 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-100 transition-colors"
                >
                  Test 🔊
                </button>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                <span className="text-sm font-bold">Haptic Feedback (Taptic Engine)</span>
              </div>
              <input
                type="checkbox"
                checked={settings.hapticsEnabled}
                onChange={(e) => onUpdateSettings({ hapticsEnabled: e.target.checked })}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl">
              <div className="flex items-center gap-2.5">
                <span>✨</span>
                <span className="text-sm font-bold">Highlight Matching Numbers</span>
              </div>
              <input
                type="checkbox"
                checked={settings.highlightMatchingNumbers}
                onChange={(e) => onUpdateSettings({ highlightMatchingNumbers: e.target.checked })}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Reset progress */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onResetProgress}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
