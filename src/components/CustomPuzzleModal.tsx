import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { Puzzle, ClueItem, Language } from '../types';

interface CustomPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayCustom: (puzzle: Puzzle) => void;
  language: Language;
  theme: 'modern' | 'notebook' | 'dark';
}

export const CustomPuzzleModal: React.FC<CustomPuzzleModalProps> = ({
  isOpen,
  onClose,
  onPlayCustom,
  language,
  theme,
}) => {
  const [title, setTitle] = useState('');
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [fact, setFact] = useState('');
  const [clues, setClues] = useState<Array<{ clue: string; answer: string }>>([
    { clue: '', answer: '' },
    { clue: '', answer: '' },
    { clue: '', answer: '' },
  ]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const isNotebook = theme === 'notebook';

  const handleAddClue = () => {
    if (clues.length >= 8) return;
    setClues([...clues, { clue: '', answer: '' }]);
  };

  const handleRemoveClue = (idx: number) => {
    if (clues.length <= 2) return;
    setClues(clues.filter((_, i) => i !== idx));
  };

  const handleClueChange = (idx: number, field: 'clue' | 'answer', value: string) => {
    const updated = [...clues];
    updated[idx][field] = field === 'answer' ? value.toUpperCase().trim() : value;
    setClues(updated);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanQuote = quote.trim().toUpperCase();
    if (!cleanQuote || cleanQuote.length < 5) {
      setError('Please enter a secret quote with at least 5 letters');
      return;
    }

    const validClues: ClueItem[] = [];
    for (let i = 0; i < clues.length; i++) {
      const c = clues[i];
      const clueText = c.clue.trim();
      const answerText = c.answer.trim().toUpperCase();

      if (!clueText || !answerText || answerText.length < 2) {
        setError(`Please fill clue definition & answer #${i + 1} (answer at least 2 letters)`);
        return;
      }

      validClues.push({
        id: `custom_c_${Date.now()}_${i}`,
        clue: clueText,
        answer: answerText,
      });
    }

    const customPuzzle: Puzzle = {
      id: `custom_${Date.now()}`,
      levelNumber: 999,
      title: title.trim() || 'Custom Puzzle',
      category: 'Custom 🎨',
      quote: cleanQuote,
      author: author.trim() || undefined,
      fact: fact.trim() || 'Your custom Crostic puzzle has been successfully deciphered!',
      difficulty: 'medium',
      language,
      clues: validClues,
    };

    onPlayCustom(customPuzzle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div
        className={`w-full max-w-xl max-h-[88vh] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col relative ${
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
            <h3 className="font-extrabold text-xl sm:text-2xl">Puzzle Creator</h3>
            <p className="text-xs opacity-60">Build your own custom Acrostic</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 opacity-70" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="flex-1 overflow-y-auto pr-1 py-4 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quote Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
              Secret Phrase / Quote *
            </label>
            <input
              type="text"
              required
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="E.g.: KEEP CALM AND CODE ON"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-sm font-semibold uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                Puzzle Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Epic Puzzle"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                Author (optional)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author Name"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Clues and Answers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                Clues & Word Answers
              </label>
              <button
                type="button"
                onClick={handleAddClue}
                disabled={clues.length >= 8}
                className="text-xs font-bold text-indigo-600 dark:text-cyan-400 flex items-center gap-1 hover:underline disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Clue</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {clues.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                >
                  <span className="text-xs font-bold opacity-60 w-4 text-center">{idx + 1}</span>
                  <input
                    type="text"
                    required
                    placeholder="Clue definition"
                    value={c.clue}
                    onChange={(e) => handleClueChange(idx, 'clue', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs sm:text-sm outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="ANSWER"
                    value={c.answer}
                    onChange={(e) => handleClueChange(idx, 'answer', e.target.value)}
                    className="w-24 sm:w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider outline-none text-center"
                  />
                  {clues.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveClue(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interesting Fact */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
              Victory Trivia / Fact
            </label>
            <textarea
              rows={2}
              value={fact}
              onChange={(e) => setFact(e.target.value)}
              placeholder="Fun fact or background about this quote..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl font-black text-base bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate & Play</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
