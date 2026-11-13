# 🎯 Linear Tasks & Changelog: Crostic Word & Cryptogram Game

## 📌 Epic: Crostic — Word & Cryptogram Crossword Puzzle Game
- **Project**: Crostic / Wordsgame
- **Status**: Completed / Done ✅
- **Priority**: High 🔴
- **Platforms**: Mobile Web (iOS Safari, Android Chrome), PWA Standalone, Native iOS (Xcode / Capacitor)
- **Live Demo**: [https://a0858707.github.io/wordsgame/](https://a0858707.github.io/wordsgame/)
- **Repository**: [https://github.com/a0858707/wordsgame](https://github.com/a0858707/wordsgame)

---

### Task 1: Core Gameplay & Bidirectional Substitution Cipher Engine
- **ID**: `CRO-1`
- **Status**: Completed ✅
- **Description**:
  - Implemented mathematical substitution cryptogram cipher engine (`src/utils/cipher.ts`).
  - Quote Mystery Board with letter tiles and cryptogram numbers underneath.
  - Definitions & Crossword Clues list with inline answer tiles.
  - Bidirectional real-time synchronization: entering a letter anywhere populates all matching numbers across quote and clues.
  - Auto-advance cursor to next tile and backspace step-back navigation.
  - Physical keyboard listeners (`A-Z`, `А-Я`, `Backspace`, `ArrowLeft/Right`, `Tab`).

---

### Task 2: Level Library & Automated Verification (60 Handcrafted Levels)
- **ID**: `CRO-2`
- **Status**: Completed ✅
- **Description**:
  - Built 60 handcrafted levels (30 English + 30 Russian).
  - Exact replica of Level 1 from original notebook spec (*"BE HAPPY THIS MOMENT"*, Omar Khayyam) with original custom cipher mapping `1..14`.
  - Exact replica of Level 2 from original mobile app spec (*"ENJOY SIMPLE PUZZLES"*).
  - Python automated letter-coverage validation pipeline ensuring 100% of quote letters are solvable via clues.
  - Added "Fascinating Fact" trivia for each level revealed on victory.

---

### Task 3: Game Modes (Daily Challenge & Custom Puzzle Creator)
- **ID**: `CRO-3`
- **Status**: Completed ✅
- **Description**:
  - **Daily Challenge mode**: 365 unique daily puzzles with calendar date format, streak tracker (🔥), and daily trophy collector (🏆).
  - **Custom Puzzle Creator**: In-game interactive builder allowing players to input custom secret quotes, clues, answers, and trivia with automatic cipher compilation.
  - **Level Selector Catalog**: Browse all levels with category badges, completion status, and 1-3 star ratings.

---

### Task 4: UI/UX Themes, Sound Engine & Power-ups
- **ID**: `CRO-4`
- **Status**: Completed ✅
- **Description**:
  - **3 Visual Themes**:
    - 📱 *Modern*: iOS-style clean cards, pastel accents, smooth shadows.
    - 📝 *Notebook*: Authentic lined notebook paper with spiral texture, marker highlights, Caveat handwritten font.
    - 🌙 *Midnight*: Dark slate with luminous cyan neon highlights.
  - **Zero-latency Web Audio API Synthesizer** (`src/utils/audio.ts`):
    - Crisp tap sound, melodious marimba chimes on letter match, word solved chord, victory fanfare.
    - Test Sound button in settings.
  - **Victory Fanfare & Confetti**: `canvas-confetti` explosion with star rating calculation.
  - **Hint Power-up System**:
    - Reveal Letter (10 coins)
    - Solve Word (25 coins)
    - Clear Errors (15 coins)
    - Free Daily Coin Chest (+30 coins)

---

### Task 5: Mobile & iPhone PWA Standalone Adaptation
- **ID**: `CRO-5`
- **Status**: Completed ✅
- **Description**:
  - Full PWA configuration (`public/manifest.json`, Apple Touch Icons, `apple-mobile-web-app-capable`).
  - iPhone notch, Dynamic Island, and home bar safe area handling via `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
  - Full viewport height locking with `100dvh` (Dynamic Viewport Height) to eliminate Safari address bar clipping.
  - Mobile touch optimizations: `touch-action: manipulation`, `-webkit-touch-callout: none`, `-webkit-tap-highlight-color: transparent`.
  - Responsive keyboard layouts (QWERTY and Cyrillic ЙЦУКЕН) proportional for mobile screens (360-390px).
  - iOS AudioContext unlocker warming up audio on first user touch gesture.

---

### Task 6: GitHub Deployment & Xcode Native iOS Integration
- **ID**: `CRO-6`
- **Status**: Completed ✅
- **Description**:
  - Created public GitHub repository and pushed all code (`https://github.com/a0858707/wordsgame`).
  - Automated deployment to GitHub Pages on `gh-pages` branch (`https://a0858707.github.io/wordsgame/`).
  - Added standalone Capacitor iOS project (`wordsgame/ios/App/App.xcodeproj`).
  - Integrated into existing Xcode project (`/Users/alexbg/Documents/ChatGPT/alawar0/ios/App/App.xcodeproj`) with automated sync script `npm run ios:sync-alawar`.
