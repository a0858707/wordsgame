import { Puzzle } from '../types';

export const DEFAULT_PUZZLES: Puzzle[] = [
  // --- LEVEL 1: From the original Crostic Notebook Mockup (Image 3) ---
  {
    id: 'crostic_en_1',
    levelNumber: 1,
    title: 'Words of Wisdom',
    category: 'Life & Philosophy',
    language: 'en',
    difficulty: 'easy',
    quote: 'BE HAPPY THIS MOMENT',
    author: 'Omar Khayyam',
    fact: 'The full Persian quatrain translates to: "Be happy for this moment. This moment is your life." Omar Khayyam was both a celebrated poet and a pioneer of medieval algebra and astronomy.',
    // Pre-mapped custom cipher numbers matching the exact notebook screenshot!
    // B=1, E=2, H=3, A=4, P=5, Y=6, F=7, O=8, R=9, T=10, I=11, S=12, M=13, N=14
    customCipher: {
      'B': 1,
      'E': 2,
      'H': 3,
      'A': 4,
      'P': 5,
      'Y': 6,
      'F': 7,
      'O': 8,
      'R': 9,
      'T': 10,
      'I': 11,
      'S': 12,
      'M': 13,
      'N': 14,
    },
    clues: [
      {
        id: 'c1',
        clue: 'Not girls',
        answer: 'BOY',
        icon: '👦',
        category: 'People'
      },
      {
        id: 'c2',
        clue: '"___ Alone" film 1990',
        answer: 'HOME',
        icon: '🏠',
        category: 'Cinema'
      },
      {
        id: 'c3',
        clue: 'Ache, hurt (syn.)',
        answer: 'PAIN',
        icon: '🦷',
        category: 'Health'
      },
      {
        id: 'c4',
        clue: 'Be afraid of (n.)',
        answer: 'FEAR',
        icon: '😨',
        category: 'Emotions'
      },
      {
        id: 'c5',
        clue: 'The science of numbers',
        answer: 'MATH',
        icon: '🔢',
        category: 'Science'
      },
    ]
  },

  // --- LEVEL 2: From the Crostic Mobile App Mockup (Image 3) ---
  {
    id: 'crostic_en_2',
    levelNumber: 2,
    title: 'Mindful Play',
    category: 'Word Fun',
    language: 'en',
    difficulty: 'easy',
    quote: 'ENJOY SIMPLE PUZZLES',
    author: 'Crostic Wisdom',
    fact: 'Solving acrostic and word puzzles engages the left brain for pattern recognition and the right brain for intuitive vocabulary recall, helping sharpen working memory and focus.',
    clues: [
      {
        id: 'c2_1',
        clue: 'Seventh month',
        answer: 'JULY',
        icon: '☀️',
        category: 'Calendar'
      },
      {
        id: 'c2_2',
        clue: 'Without difficulty',
        answer: 'SIMPLY',
        icon: '✨',
        category: 'Language'
      },
      {
        id: 'c2_3',
        clue: 'Win __, lose __',
        answer: 'SOME',
        icon: '🎲',
        category: 'Proverb'
      },
      {
        id: 'c2_4',
        clue: 'Follower of here or there',
        answer: 'UPON',
        icon: '📍',
        category: 'Grammar'
      },
      {
        id: 'c2_5',
        clue: 'A settled quantity or allowance',
        answer: 'SIZE',
        icon: '📏',
        category: 'Measurement'
      }
    ]
  },

  // --- LEVEL 3: Classic Curiosity ---
  {
    id: 'crostic_en_3',
    levelNumber: 3,
    title: 'Endless Horizon',
    category: 'Inspiration',
    language: 'en',
    difficulty: 'medium',
    quote: 'NEVER STOP EXPLORING',
    author: 'T.S. Eliot',
    fact: 'T.S. Eliot famously wrote in Little Gidding: "We shall not cease from exploration, and the end of all our exploring will be to arrive where we started and know the place for the first time."',
    clues: [
      {
        id: 'c3_1',
        clue: 'Earth\'s natural satellite',
        answer: 'MOON',
        icon: '🌕',
        category: 'Astronomy'
      },
      {
        id: 'c3_2',
        clue: 'Deep affection or fondness',
        answer: 'LOVE',
        icon: '❤️',
        category: 'Emotions'
      },
      {
        id: 'c3_3',
        clue: 'Water frozen solid',
        answer: 'ICE',
        icon: '🧊',
        category: 'Nature'
      },
      {
        id: 'c3_4',
        clue: 'Spring blooming flower',
        answer: 'ROSE',
        icon: '🌹',
        category: 'Botany'
      },
      {
        id: 'c3_5',
        clue: 'To produce music with vocal cords',
        answer: 'SING',
        icon: '🎵',
        category: 'Arts'
      }
    ]
  },

  // --- LEVEL 4: Timeless Knowledge ---
  {
    id: 'crostic_en_4',
    levelNumber: 4,
    title: 'Secret of Power',
    category: 'Philosophy',
    language: 'en',
    difficulty: 'medium',
    quote: 'KNOWLEDGE IS MIGHTY POWER',
    author: 'Francis Bacon',
    fact: 'Sir Francis Bacon coined "Scientia potentia est" in 1597. It became the cornerstone motto for the Age of Enlightenment and modern scientific inquiry.',
    clues: [
      {
        id: 'c4_1',
        clue: 'Opposite of white',
        answer: 'BLACK',
        icon: '⚫',
        category: 'Colors'
      },
      {
        id: 'c4_2',
        clue: 'To move swiftly on foot',
        answer: 'RUN',
        icon: '🏃',
        category: 'Action'
      },
      {
        id: 'c4_3',
        clue: 'Time between sunset and sunrise',
        answer: 'NIGHT',
        icon: '🌙',
        category: 'Time'
      },
      {
        id: 'c4_4',
        clue: 'Fast aerodynamic aircraft',
        answer: 'PLANE',
        icon: '✈️',
        category: 'Travel'
      },
      {
        id: 'c4_5',
        clue: 'Sweet honey producer insect',
        answer: 'BEE',
        icon: '🐝',
        category: 'Animals'
      }
    ]
  },

  // ================= RUSSIAN PUZZLES (РУССКИЕ УРОВНИ) =================
  {
    id: 'crostic_ru_1',
    levelNumber: 1,
    title: 'Народная Мудрость',
    category: 'Пословицы',
    language: 'ru',
    difficulty: 'easy',
    quote: 'ЛУЧШЕ ПОЗДНО ЧЕМ НИКОГДА',
    author: 'Тит Ливий',
    fact: 'Выражение "Лучше поздно, чем никогда" впервые письменно зафиксировано у римского историка Тита Ливия в труде "История от основания города", где он цитирует древнеримских ораторов.',
    clues: [
      {
        id: 'ru1_1',
        clue: 'Естественный спутник Земли',
        answer: 'ЛУНА',
        icon: '🌙',
        category: 'Космос'
      },
      {
        id: 'ru1_2',
        clue: 'Время суток после заката солнца',
        answer: 'НОЧЬ',
        icon: '🌌',
        category: 'Время'
      },
      {
        id: 'ru1_3',
        clue: 'Теплый головной убор',
        answer: 'ШАПКА',
        icon: '🧢',
        category: 'Одежда'
      },
      {
        id: 'ru1_4',
        clue: 'Холодное время года со снегом',
        answer: 'ЗИМА',
        icon: '❄️',
        category: 'Сезоны'
      },
      {
        id: 'ru1_5',
        clue: 'Сладкая лесная или садовая ягода',
        answer: 'МАЛИНА',
        icon: '🫐',
        category: 'Природа'
      },
      {
        id: 'ru1_6',
        clue: 'Высокая каменная возвышенность',
        answer: 'ГОРА',
        icon: '⛰️',
        category: 'География'
      },
      {
        id: 'ru1_7',
        clue: 'Небольшой искусственный водоем',
        answer: 'ПРУД',
        icon: '🌊',
        category: 'Природа'
      }
    ]
  },
  {
    id: 'crostic_ru_2',
    levelNumber: 2,
    title: 'Великая Классика',
    category: 'Литература',
    language: 'ru',
    difficulty: 'medium',
    quote: 'КРАСОТА СПАСЕТ МИР',
    author: 'Фёдор Достоевский',
    fact: 'Афоризм принадлежит князю Льву Мышкину из романа "Идиот" (1868). Достоевский вкладывал в понятие красоты не внешний блеск, а возвышенную гармонию души, доброту и искренность.',
    clues: [
      {
        id: 'ru2_1',
        clue: 'Орган зрения человека и животных',
        answer: 'ГЛАЗА',
        icon: '👁️',
        category: 'Анатомия'
      },
      {
        id: 'ru2_2',
        clue: 'Морской разбойник и корсар',
        answer: 'ПИРАТ',
        icon: '🏴‍☠️',
        category: 'История'
      },
      {
        id: 'ru2_3',
        clue: 'Царь зверей с пышной гривой',
        answer: 'ЛЕВ',
        icon: '🦁',
        category: 'Животные'
      },
      {
        id: 'ru2_4',
        clue: 'Праздничный сладкий десерт со свечами',
        answer: 'ТОРТ',
        icon: '🎂',
        category: 'Кулинария'
      },
      {
        id: 'ru2_5',
        clue: 'Красный корнеплод для борща',
        answer: 'СВЕКЛА',
        icon: '🥗',
        category: 'Кулинария'
      },
      {
        id: 'ru2_6',
        clue: 'Сумка для путешествий с колесиками',
        answer: 'ЧЕМОДАН',
        icon: '🧳',
        category: 'Путешествия'
      }
    ]
  },
  {
    id: 'crostic_ru_3',
    levelNumber: 3,
    title: 'Сила Разума',
    category: 'Наука и Мышление',
    language: 'ru',
    difficulty: 'medium',
    quote: 'ЗНАНИЕ ЭТО ВЕЛИКАЯ СИЛА',
    author: 'Фрэнсис Бэкон',
    fact: 'Слова "Знание — сила" стали девизом просветителей по всему миру. В русском языке они часто украшали фронтоны библиотек, обсерваторий и университетских аудиторий.',
    clues: [
      {
        id: 'ru3_1',
        clue: 'Музыкальный инструмент со струнами',
        answer: 'ГИТАРА',
        icon: '🎸',
        category: 'Музыка'
      },
      {
        id: 'ru3_2',
        clue: 'Белый пушистый зимний осадок',
        answer: 'СНЕГ',
        icon: '❄️',
        category: 'Погода'
      },
      {
        id: 'ru3_3',
        clue: 'Столица Франции',
        answer: 'ПАРИЖ',
        icon: '🗼',
        category: 'Города'
      },
      {
        id: 'ru3_4',
        clue: 'Время года, когда тает снег и поют птицы',
        answer: 'ВЕСНА',
        icon: '🌷',
        category: 'Сезоны'
      },
      {
        id: 'ru3_5',
        clue: 'Главнокомандующий на корабле',
        answer: 'КАПИТАН',
        icon: '⚓',
        category: 'Профессии'
      }
    ]
  }
];

export function getPuzzleById(id: string): Puzzle | undefined {
  return DEFAULT_PUZZLES.find(p => p.id === id);
}

export function getPuzzlesByLanguage(lang: 'en' | 'ru'): Puzzle[] {
  return DEFAULT_PUZZLES.filter(p => p.language === lang);
}

/**
 * Returns or generates a Daily Challenge puzzle for today
 */
export function getDailyPuzzle(date: Date = new Date()): Puzzle {
  const dateStr = date.toISOString().slice(0, 10);
  const day = date.getDate();
  const index = day % DEFAULT_PUZZLES.length;
  const base = DEFAULT_PUZZLES[index];
  
  return {
    ...base,
    id: `daily_${dateStr}`,
    title: `Daily Challenge • ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
    category: 'Daily Trophy 🏆',
  };
}
