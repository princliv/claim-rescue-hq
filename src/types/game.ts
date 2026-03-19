export interface LevelResult {
  level: number;
  score: number;
  time: number;
  totalQuestions: number;
  correctAnswers: number;
  hintsUsed: number;
  stepScore: number;
  quizScore: number;
  decisionScore: number;
  timeBonus: number;
  bonusScore?: number;
}

export interface InvestigationStep {
  id: string;
  label: string;
  icon: string;
  data: string;
}

export interface LevelScenario {
  patientType: string;
  tob: string;
  revenueCodes: string[];
  admissionDate: string;
  serviceDate: string;
  splitBlEdit: string;
  mhiHint: string;
  cfiHint: string;
  hcpcs?: string[];
}

export interface KnowledgeQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface GameState {
  currentScreen: 'start' | 'roleBriefing' | 'levelSelect' | 'gameplay' | 'levelResults' | 'finalDashboard' | 'howToPlay';
  currentLevel: number;
  unlockedLevels: number[];
  levelResults: LevelResult[];
  totalScore: number;
  bestScore: number;
  starRatings: Record<number, number>;
}

export type Screen = GameState['currentScreen'];

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Basic SPLITBL Identification',
  2: 'SPLITBL Not Applicable',
  3: 'SB Field Code Interpretation',
  4: 'Exception Case (Ambulance)',
  5: 'Advanced Case (Multiple Rules)',
};

export const LEVEL_FORMATS: Record<number, string> = {
  1: 'Identify Facility Setup',
  2: 'Physician Rule Check',
  3: 'Indicator Interpretation',
  4: 'Exclusion Verification',
  5: 'Complex Rule Logic',
};
