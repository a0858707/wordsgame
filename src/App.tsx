import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { QuoteBoard } from './components/QuoteBoard';
import { CluesList } from './components/CluesList';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { WinModal } from './components/WinModal';
import { HintModal } from './components/HintModal';
import { DailyModal } from './components/DailyModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { CustomPuzzleModal } from './components/CustomPuzzleModal';
import { SettingsModal } from './components/SettingsModal';
import { Puzzle, GameSettings, LevelProgress } from './types';
import { DEFAULT_PUZZLES, getDailyPuzzle } from './data/defaultPuzzles';
import { buildCipher, isQuoteCompleted, isClueSolved, getQuoteProgress, isLetter, normalizeLetter } from './utils/cipher';
import { sound } from './utils/audio';
import {
  loadSettings,
  saveSettings,
  loadCoins,
  saveCoins,
  loadAllProgress,
  saveLevelProgress,
  loadActiveLevelId,
  saveActiveLevelId,
} from './utils/storage';

export const App: React.FC = () => {
  // Game Settings & Preferences
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [coins, setCoins] = useState<number>(() => loadCoins());
  const [progressMap, setProgressMap] = useState<Record<string, LevelProgress>>(() => loadAllProgress());
  
  // Custom Puzzles created by the player
  const [customPuzzles, setCustomPuzzles] = useState<Puzzle[]>([]);

  // All combined puzzles
  const allPuzzles = useMemo(() => [...DEFAULT_PUZZLES, ...customPuzzles], [customPuzzles]);

  // Current Active Puzzle
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(() => {
    const savedId = loadActiveLevelId();
    if (savedId) {
      const found = DEFAULT_PUZZLES.find((p) => p.id === savedId);
      if (found) return found;
    }
    // Default to Level 1 in the saved language
    return DEFAULT_PUZZLES.find((p) => p.language === settings.language) || DEFAULT_PUZZLES[0];
  });

  // Cipher Mapping for active puzzle
  const cipher = useMemo(() => buildCipher(currentPuzzle), [currentPuzzle]);

  // Player guesses: mapping of cipher number -> letter (e.g. { 10: 'E', 6: 'Y' })
  const [guesses, setGuesses] = useState<Record<number, string>>(() => {
    const saved = progressMap[currentPuzzle.id];
    return saved?.guesses || {};
  });

  // Current selection focus
  const [activeNumber, setActiveNumber] = useState<number | null>(() => {
    // Pick the first letter's number in the quote
    for (const char of currentPuzzle.quote) {
      if (isLetter(char)) {
        const norm = normalizeLetter(char);
        return cipher.letterToNumber[norm] ?? null;
      }
    }
    return null;
  });

  const [activeClueId, setActiveClueId] = useState<string | null>(() => {
    return currentPuzzle.clues[0]?.id || null;
  });

  const [activeTileIndex, setActiveTileIndex] = useState<number>(0);
  const [activeTargetType, setActiveTargetType] = useState<'quote' | 'clue'>('quote');

  // Stats & Progress
  const [hintsUsed, setHintsUsed] = useState<number>(() => progressMap[currentPuzzle.id]?.hintsUsed || 0);
  const [startTime] = useState<number>(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(() => Boolean(progressMap[currentPuzzle.id]?.solved));

  // Modal states
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync sound engine options
  useEffect(() => {
    sound.enabled = settings.soundEnabled;
    sound.haptics = settings.hapticsEnabled;
  }, [settings.soundEnabled, settings.hapticsEnabled]);

  // Timer for elapsed seconds
  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  // Quote progress percentage
  const { percentage: quoteProgress } = useMemo(() => {
    return getQuoteProgress(currentPuzzle.quote, guesses, cipher);
  }, [currentPuzzle.quote, guesses, cipher]);

  // Stars earned across all levels
  const totalStars = useMemo(() => {
    return Object.values(progressMap).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  }, [progressMap]);

  // Daily streak
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().slice(0, 10);
      if (progressMap[`daily_${dStr}`]?.solved) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [progressMap]);

  // Handle puzzle switch
  const loadPuzzle = useCallback(
    (newPuzzle: Puzzle) => {
      setCurrentPuzzle(newPuzzle);
      saveActiveLevelId(newPuzzle.id);

      const newCipher = buildCipher(newPuzzle);
      const savedProg = progressMap[newPuzzle.id];
      const initialGuesses = savedProg?.guesses || {};

      setGuesses(initialGuesses);
      setHintsUsed(savedProg?.hintsUsed || 0);
      setElapsedSeconds(0);
      setIsWon(Boolean(savedProg?.solved));
      setIsWinModalOpen(false);

      // Select first letter of quote
      for (const char of newPuzzle.quote) {
        if (isLetter(char)) {
          const norm = normalizeLetter(char);
          setActiveNumber(newCipher.letterToNumber[norm] ?? null);
          break;
        }
      }

      setActiveClueId(newPuzzle.clues[0]?.id || null);
      setActiveTileIndex(0);
      setActiveTargetType('quote');
    },
    [progressMap]
  );

  // Focus a specific number
  const handleSelectNumber = (num: number, targetType: 'quote' | 'clue', clueId?: string, index?: number) => {
    setActiveNumber(num);
    setActiveTargetType(targetType);
    if (clueId) setActiveClueId(clueId);
    if (index !== undefined) setActiveTileIndex(index);
    sound.playTap();
    sound.vibrate(10);
  };

  // Focus a specific tile in a clue
  const handleSelectClueTile = (clueId: string, index: number, num: number) => {
    setActiveClueId(clueId);
    setActiveTileIndex(index);
    setActiveNumber(num);
    setActiveTargetType('clue');
    sound.playTap();
    sound.vibrate(10);
  };

  // Move to next tile
  const advanceToNextTile = useCallback(() => {
    if (activeTargetType === 'clue' && activeClueId) {
      const currentClue = currentPuzzle.clues.find((c) => c.id === activeClueId);
      if (currentClue) {
        // Find next letter in this clue
        let nextIdx = activeTileIndex + 1;
        while (nextIdx < currentClue.answer.length && !isLetter(currentClue.answer[nextIdx])) {
          nextIdx++;
        }

        if (nextIdx < currentClue.answer.length) {
          const nextChar = normalizeLetter(currentClue.answer[nextIdx]);
          const nextNum = cipher.letterToNumber[nextChar];
          setActiveTileIndex(nextIdx);
          setActiveNumber(nextNum);
          return;
        } else {
          // Move to next clue
          const clueIdx = currentPuzzle.clues.findIndex((c) => c.id === activeClueId);
          if (clueIdx < currentPuzzle.clues.length - 1) {
            const nextClue = currentPuzzle.clues[clueIdx + 1];
            setActiveClueId(nextClue.id);
            setActiveTileIndex(0);
            const firstChar = normalizeLetter(nextClue.answer[0]);
            setActiveNumber(cipher.letterToNumber[firstChar]);
            return;
          }
        }
      }
    }

    // Default or quote mode: advance to next number in quote
    const lettersInQuote: number[] = [];
    for (const char of currentPuzzle.quote) {
      if (isLetter(char)) {
        const norm = normalizeLetter(char);
        lettersInQuote.push(cipher.letterToNumber[norm]);
      }
    }

    if (activeNumber !== null) {
      const currPos = lettersInQuote.indexOf(activeNumber);
      if (currPos !== -1 && currPos < lettersInQuote.length - 1) {
        // Next unfilled or next number
        for (let i = currPos + 1; i < lettersInQuote.length; i++) {
          const num = lettersInQuote[i];
          if (!guesses[num]) {
            setActiveNumber(num);
            return;
          }
        }
        // If all after are filled, pick next
        setActiveNumber(lettersInQuote[currPos + 1]);
      }
    }
  }, [activeTargetType, activeClueId, currentPuzzle, activeTileIndex, activeNumber, cipher, guesses]);

  // Backspace to previous tile
  const stepBackTile = useCallback(() => {
    if (activeTargetType === 'clue' && activeClueId) {
      const currentClue = currentPuzzle.clues.find((c) => c.id === activeClueId);
      if (currentClue && activeTileIndex > 0) {
        let prevIdx = activeTileIndex - 1;
        while (prevIdx >= 0 && !isLetter(currentClue.answer[prevIdx])) {
          prevIdx--;
        }
        if (prevIdx >= 0) {
          const prevChar = normalizeLetter(currentClue.answer[prevIdx]);
          const prevNum = cipher.letterToNumber[prevChar];
          setActiveTileIndex(prevIdx);
          setActiveNumber(prevNum);
        }
      }
    }
  }, [activeTargetType, activeClueId, currentPuzzle, activeTileIndex, cipher]);

  // Enter a character
  const handleKeyPress = useCallback(
    (rawChar: string) => {
      if (isWon || activeNumber === null) return;
      if (!isLetter(rawChar)) return;

      const char = normalizeLetter(rawChar);
      const expectedLetter = cipher.numberToLetter[activeNumber];
      const isCorrectLetter = expectedLetter === char;

      // Update guesses map
      const nextGuesses = {
        ...guesses,
        [activeNumber]: char,
      };
      setGuesses(nextGuesses);

      // Play audio feedback
      if (isCorrectLetter) {
        sound.playLetterChime(activeNumber);
      } else {
        sound.playTap();
      }
      sound.vibrate(12);

      // Check if the current clue was completed
      if (activeClueId) {
        const currentClue = currentPuzzle.clues.find((c) => c.id === activeClueId);
        if (currentClue) {
          const wasSolvedBefore = isClueSolved(currentClue.answer, guesses, cipher);
          const isSolvedNow = isClueSolved(currentClue.answer, nextGuesses, cipher);
          if (!wasSolvedBefore && isSolvedNow) {
            setTimeout(() => {
              sound.playWordSolved();
              sound.vibrate([20, 40, 20]);
            }, 80);
          }
        }
      }

      // Check if entire puzzle quote is solved!
      const quoteSolved = isQuoteCompleted(currentPuzzle.quote, nextGuesses, cipher);
      if (quoteSolved && !isWon) {
        setIsWon(true);

        // Calculate stars
        let earnedStars = 3;
        if (hintsUsed >= 4) earnedStars = 1;
        else if (hintsUsed >= 2) earnedStars = 2;

        const isDaily = currentPuzzle.id.startsWith('daily');
        const rewardCoins = isDaily ? 50 : 25;
        const newCoinTotal = coins + rewardCoins;

        setCoins(newCoinTotal);
        saveCoins(newCoinTotal);

        const newProgress: LevelProgress = {
          solved: true,
          stars: Math.max(earnedStars, progressMap[currentPuzzle.id]?.stars || 0),
          timeSpent: elapsedSeconds,
          score: 1000 - elapsedSeconds * 2 - hintsUsed * 50,
          guesses: nextGuesses,
          hintsUsed,
          completedAt: new Date().toISOString(),
        };

        const updatedProgressMap = {
          ...progressMap,
          [currentPuzzle.id]: newProgress,
        };
        setProgressMap(updatedProgressMap);
        saveLevelProgress(currentPuzzle.id, newProgress);

        // Victory fanfare and open modal
        setTimeout(() => {
          sound.playVictoryFanfare();
          sound.vibrate([100, 50, 150]);
          setIsWinModalOpen(true);
        }, 300);
        return;
      }

      // Save interim progress
      saveLevelProgress(currentPuzzle.id, {
        solved: false,
        stars: 0,
        timeSpent: elapsedSeconds,
        score: 0,
        guesses: nextGuesses,
        hintsUsed,
      });

      // Auto-advance
      if (settings.autoAdvance) {
        advanceToNextTile();
      }
    },
    [
      isWon,
      activeNumber,
      cipher,
      guesses,
      activeClueId,
      currentPuzzle,
      hintsUsed,
      coins,
      progressMap,
      elapsedSeconds,
      settings.autoAdvance,
      advanceToNextTile,
    ]
  );

  // Backspace handler
  const handleBackspace = useCallback(() => {
    if (isWon || activeNumber === null) return;

    sound.playTap();
    sound.vibrate(10);

    if (guesses[activeNumber]) {
      // Clear current letter
      const nextGuesses = { ...guesses };
      delete nextGuesses[activeNumber];
      setGuesses(nextGuesses);
    } else {
      // If already empty, step back and clear
      stepBackTile();
    }
  }, [isWon, activeNumber, guesses, stepBackTile]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input/textarea inside a modal is focused
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
        e.preventDefault();
        advanceToNextTile();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepBackTile();
      } else if (isLetter(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBackspace, advanceToNextTile, stepBackTile, handleKeyPress]);

  // Hint: Reveal current letter (10 coins)
  const handleRevealLetter = () => {
    if (coins < 10 || activeNumber === null) return;

    const correctLetter = cipher.numberToLetter[activeNumber];
    if (!correctLetter) return;

    const nextCoins = coins - 10;
    setCoins(nextCoins);
    saveCoins(nextCoins);
    setHintsUsed((prev) => prev + 1);

    const nextGuesses = {
      ...guesses,
      [activeNumber]: correctLetter,
    };
    setGuesses(nextGuesses);
    sound.playHintSparkle();

    setIsHintModalOpen(false);

    // Check if won
    if (isQuoteCompleted(currentPuzzle.quote, nextGuesses, cipher)) {
      setTimeout(() => {
        setIsWon(true);
        sound.playVictoryFanfare();
        setIsWinModalOpen(true);
      }, 300);
    } else {
      advanceToNextTile();
    }
  };

  // Hint: Solve active clue word (25 coins)
  const handleRevealWord = () => {
    if (coins < 25 || !activeClueId) return;

    const currentClue = currentPuzzle.clues.find((c) => c.id === activeClueId);
    if (!currentClue) return;

    const nextCoins = coins - 25;
    setCoins(nextCoins);
    saveCoins(nextCoins);
    setHintsUsed((prev) => prev + 2);

    const nextGuesses = { ...guesses };
    for (const char of currentClue.answer) {
      if (isLetter(char)) {
        const norm = normalizeLetter(char);
        const num = cipher.letterToNumber[norm];
        nextGuesses[num] = norm;
      }
    }

    setGuesses(nextGuesses);
    sound.playHintSparkle();
    setTimeout(() => sound.playWordSolved(), 200);

    setIsHintModalOpen(false);

    if (isQuoteCompleted(currentPuzzle.quote, nextGuesses, cipher)) {
      setTimeout(() => {
        setIsWon(true);
        sound.playVictoryFanfare();
        setIsWinModalOpen(true);
      }, 400);
    }
  };

  // Hint: Clear errors (15 coins)
  const handleCheckErrors = () => {
    if (coins < 15) return;

    const nextCoins = coins - 15;
    setCoins(nextCoins);
    saveCoins(nextCoins);
    setHintsUsed((prev) => prev + 1);

    let hadErrors = false;
    const nextGuesses = { ...guesses };

    for (const [numStr, guessChar] of Object.entries(guesses)) {
      const num = parseInt(numStr, 10);
      const expected = cipher.numberToLetter[num];
      if (guessChar.toUpperCase() !== expected) {
        delete nextGuesses[num];
        hadErrors = true;
      }
    }

    setGuesses(nextGuesses);
    sound.playHintSparkle();
    setIsHintModalOpen(false);
  };

  // Claim free coins bonus
  const handleFreeCoins = () => {
    const nextCoins = coins + 30;
    setCoins(nextCoins);
    saveCoins(nextCoins);
    sound.playHintSparkle();
    setIsHintModalOpen(false);
  };

  // Next level handler
  const handleNextLevel = () => {
    setIsWinModalOpen(false);

    const currentIdx = allPuzzles.findIndex((p) => p.id === currentPuzzle.id);
    const nextPuzzle =
      currentIdx !== -1 && currentIdx < allPuzzles.length - 1
        ? allPuzzles[currentIdx + 1]
        : allPuzzles[0];

    loadPuzzle(nextPuzzle);
  };

  // Play today's daily challenge
  const handlePlayDaily = () => {
    const dailyPuz = getDailyPuzzle();
    loadPuzzle(dailyPuz);
  };

  // Add custom puzzle
  const handlePlayCustom = (puz: Puzzle) => {
    setCustomPuzzles((prev) => [puz, ...prev]);
    loadPuzzle(puz);
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);

    if (newSettings.language && newSettings.language !== currentPuzzle.language) {
      const matchingPuzzle = DEFAULT_PUZZLES.find((p) => p.language === newSettings.language);
      if (matchingPuzzle) {
        loadPuzzle(matchingPuzzle);
      }
    }
  };

  // Reset all game progress
  const handleResetProgress = () => {
    if (window.confirm(settings.language === 'ru' ? 'Вы уверены, что хотите сбросить прогресс?' : 'Are you sure you want to reset all progress?')) {
      localStorage.clear();
      setProgressMap({});
      setCoins(60);
      setGuesses({});
      setIsWon(false);
      setIsSettingsOpen(false);
      const first = DEFAULT_PUZZLES[0];
      loadPuzzle(first);
    }
  };

  const isDark = settings.theme === 'dark';
  const isNotebook = settings.theme === 'notebook';

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
        isDark
          ? 'bg-slate-950 text-slate-100'
          : isNotebook
          ? 'notebook-bg text-amber-950'
          : 'bg-slate-100 text-slate-800'
      }`}
    >
      {/* Top Header */}
      <Header
        puzzle={currentPuzzle}
        progressPercentage={quoteProgress}
        coins={coins}
        stars={totalStars}
        streak={streak}
        theme={settings.theme}
        onOpenDaily={() => setIsDailyModalOpen(true)}
        onOpenLevels={() => setIsLevelSelectOpen(true)}
        onOpenCustom={() => setIsCustomModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Play Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-4 py-3 flex flex-col gap-3 sm:gap-4 overflow-y-auto">
        {/* Quote Mystery Board */}
        <QuoteBoard
          quote={currentPuzzle.quote}
          guesses={guesses}
          cipher={cipher}
          activeNumber={activeNumber}
          onSelectNumber={handleSelectNumber}
          theme={settings.theme}
        />

        {/* Clues & Definitions List */}
        <CluesList
          clues={currentPuzzle.clues}
          guesses={guesses}
          cipher={cipher}
          activeClueId={activeClueId}
          activeTileIndex={activeTileIndex}
          activeNumber={activeNumber}
          onSelectTile={handleSelectClueTile}
          theme={settings.theme}
        />
      </main>

      {/* Fixed Bottom Virtual Keyboard */}
      <footer className="w-full shrink-0 sticky bottom-0 z-30">
        <VirtualKeyboard
          language={currentPuzzle.language}
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onHintClick={() => setIsHintModalOpen(true)}
          hintCost={10}
          canAffordHint={coins >= 10}
          theme={settings.theme}
        />
      </footer>

      {/* Modals */}
      {isWinModalOpen && (
        <WinModal
          puzzle={currentPuzzle}
          stars={hintsUsed <= 1 ? 3 : hintsUsed <= 3 ? 2 : 1}
          coinsEarned={currentPuzzle.id.startsWith('daily') ? 50 : 25}
          timeSpent={elapsedSeconds}
          onNextLevel={handleNextLevel}
          onClose={() => setIsWinModalOpen(false)}
          theme={settings.theme}
        />
      )}

      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        coins={coins}
        onRevealLetter={handleRevealLetter}
        onRevealWord={handleRevealWord}
        onCheckErrors={handleCheckErrors}
        onFreeCoins={handleFreeCoins}
        theme={settings.theme}
        language={settings.language}
      />

      <DailyModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        dailyPuzzle={getDailyPuzzle()}
        isCompletedToday={Boolean(progressMap[getDailyPuzzle().id]?.solved)}
        streak={streak}
        onPlayDaily={handlePlayDaily}
        theme={settings.theme}
        language={settings.language}
      />

      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        puzzles={allPuzzles}
        currentPuzzleId={currentPuzzle.id}
        progressMap={progressMap}
        language={settings.language}
        onSelectLevel={loadPuzzle}
        onLanguageChange={(lang) => handleUpdateSettings({ language: lang })}
        theme={settings.theme}
      />

      <CustomPuzzleModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onPlayCustom={handlePlayCustom}
        language={settings.language}
        theme={settings.theme}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
};

export default App;
