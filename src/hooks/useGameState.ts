import { useState, useCallback } from 'react';
import { GameState, LevelResult } from '@/types/game';

const BEST_SCORE_KEY = 'claim-rescue-best-score';
const STAR_RATINGS_KEY = 'claim-rescue-stars';

function loadBestScore(): number {
  try { return parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10); } catch { return 0; }
}

function loadStarRatings(): Record<number, number> {
  try { return JSON.parse(localStorage.getItem(STAR_RATINGS_KEY) || '{}'); } catch { return {}; }
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    currentScreen: 'start',
    currentLevel: 1,
    unlockedLevels: [1],
    levelResults: [],
    totalScore: 0,
    bestScore: loadBestScore(),
    starRatings: loadStarRatings(),
  });

  const navigate = useCallback((screen: GameState['currentScreen']) => {
    setState(s => ({ ...s, currentScreen: screen }));
  }, []);

  const startLevel = useCallback((level: number) => {
    setState(s => ({ ...s, currentLevel: level, currentScreen: 'gameplay' }));
  }, []);

  const completeLevel = useCallback((result: LevelResult) => {
    setState(s => {
      const newResults = [...s.levelResults.filter(r => r.level !== result.level), result];
      const newTotal = newResults.reduce((sum, r) => sum + r.score, 0);
      const newBest = Math.max(s.bestScore, newTotal);
      const accuracy = result.totalQuestions > 0 ? result.correctAnswers / result.totalQuestions : 0;
      const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.6 ? 2 : 1;
      const newStars = { ...s.starRatings, [result.level]: Math.max(s.starRatings[result.level] || 0, stars) };
      const newUnlocked = s.unlockedLevels.includes(result.level + 1) || result.level >= 5
        ? s.unlockedLevels
        : [...s.unlockedLevels, result.level + 1];

      localStorage.setItem(BEST_SCORE_KEY, String(newBest));
      localStorage.setItem(STAR_RATINGS_KEY, JSON.stringify(newStars));

      return {
        ...s,
        levelResults: newResults,
        totalScore: newTotal,
        bestScore: newBest,
        starRatings: newStars,
        unlockedLevels: newUnlocked,
        currentScreen: result.level === 5 && newResults.length === 5 ? 'finalDashboard' : 'levelResults',
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(s => ({
      currentScreen: 'start',
      currentLevel: 1,
      unlockedLevels: [1],
      levelResults: [],
      totalScore: 0,
      bestScore: s.bestScore,
      starRatings: s.starRatings,
    }));
  }, []);

  return { state, navigate, startLevel, completeLevel, resetGame };
}
