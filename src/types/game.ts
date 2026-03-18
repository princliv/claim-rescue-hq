export interface LevelResult {
  level: number;
  score: number;
  time: number;
  totalQuestions: number;
  correctAnswers: number;
  hintsUsed: number;
}

export interface GameState {
  currentScreen: 'start' | 'roleBriefing' | 'levelSelect' | 'gameplay' | 'levelResults' | 'finalDashboard';
  currentLevel: number;
  unlockedLevels: number[];
  levelResults: LevelResult[];
  totalScore: number;
  bestScore: number;
  starRatings: Record<number, number>;
}

export type Screen = GameState['currentScreen'];

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Basic LCD Denial',
  2: 'NCD Case Investigation',
  3: 'Authorization Override',
  4: 'DX Mismatch Puzzle',
  5: 'Multi-Service Manager',
};

export const LEVEL_FORMATS: Record<number, string> = {
  1: 'Step-by-Step Detective',
  2: 'Drag & Drop Board',
  3: 'Terminal Simulator',
  4: 'Comparison Puzzle',
  5: 'Split-Screen Dual Case',
};
