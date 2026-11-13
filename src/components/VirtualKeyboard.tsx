import React from 'react';
import { Delete, Lightbulb } from 'lucide-react';
import { Language } from '../types';

interface VirtualKeyboardProps {
  language: Language;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onHintClick: () => void;
  hintCost: number;
  canAffordHint: boolean;
  theme: 'modern' | 'notebook' | 'dark';
}

const EN_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const RU_LAYOUT = [
  ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х'],
  ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
  ['Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю'],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  language,
  onKeyPress,
  onBackspace,
  onHintClick,
  hintCost,
  canAffordHint,
  theme,
}) => {
  const layout = language === 'ru' ? RU_LAYOUT : EN_LAYOUT;
  const isDark = theme === 'dark';
  const isNotebook = theme === 'notebook';

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-1.5 sm:p-2.5 rounded-t-2xl sm:rounded-2xl transition-all shadow-lg ${
        isDark
          ? 'bg-slate-900/95 border-t sm:border border-slate-800'
          : isNotebook
          ? 'bg-[#f5f1e8] border-t sm:border-2 border-amber-300 shadow-md'
          : 'bg-white/95 border-t sm:border border-slate-200/90 shadow-sm backdrop-blur-md'
      }`}
    >
      <div className="flex flex-col gap-1 sm:gap-1.5 items-center">
        {/* Row 1 */}
        <div className="flex gap-1 sm:gap-1.5 justify-center w-full">
          {layout[0].map((char) => (
            <KeyButton
              key={char}
              char={char}
              onClick={() => onKeyPress(char)}
              isDark={isDark}
              isNotebook={isNotebook}
            />
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex gap-1 sm:gap-1.5 justify-center w-full px-2 sm:px-4">
          {layout[1].map((char) => (
            <KeyButton
              key={char}
              char={char}
              onClick={() => onKeyPress(char)}
              isDark={isDark}
              isNotebook={isNotebook}
            />
          ))}
        </div>

        {/* Row 3 with Hint & Backspace */}
        <div className="flex gap-1 sm:gap-1.5 justify-center w-full">
          {/* Hint Bulb Button */}
          <button
            onClick={onHintClick}
            type="button"
            className={`relative flex items-center justify-center gap-1 px-2.5 sm:px-3 h-10 sm:h-12 rounded-lg font-bold transition-all active:scale-90 cursor-pointer shadow-xs ${
              isDark
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
            }`}
            title={`Hint (${hintCost} coins)`}
          >
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-black bg-amber-500 text-white rounded-full px-1.5 py-0.2">
              {hintCost}
            </span>
          </button>

          {/* Letters in row 3 */}
          {layout[2].map((char) => (
            <KeyButton
              key={char}
              char={char}
              onClick={() => onKeyPress(char)}
              isDark={isDark}
              isNotebook={isNotebook}
            />
          ))}

          {/* Backspace Button */}
          <button
            onClick={onBackspace}
            type="button"
            className={`flex items-center justify-center px-2.5 sm:px-3.5 h-10 sm:h-12 rounded-lg font-bold transition-all active:scale-90 cursor-pointer shadow-xs ${
              isDark
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                : isNotebook
                ? 'bg-amber-200 text-amber-950 hover:bg-amber-300 border border-amber-300'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300'
            }`}
            title="Backspace"
          >
            <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface KeyButtonProps {
  char: string;
  onClick: () => void;
  isDark: boolean;
  isNotebook: boolean;
}

const KeyButton: React.FC<KeyButtonProps> = ({ char, onClick, isDark, isNotebook }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex-1 min-w-[24px] max-w-[42px] h-10 sm:h-12 rounded-lg font-extrabold text-sm sm:text-base flex items-center justify-center transition-all duration-100 active:scale-95 cursor-pointer shadow-xs select-none ${
        isDark
          ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 active:bg-slate-600'
          : isNotebook
          ? 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-300/80 active:bg-amber-200 font-serif'
          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 active:bg-slate-200'
      }`}
    >
      {char}
    </button>
  );
};
