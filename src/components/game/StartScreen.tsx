import React, { useState, useEffect } from 'react';
import AppDashboard from './AppDashboard';
import StartSimulationModal from './StartSimulationModal';
import { GameState } from '@/types/game';

interface StartScreenProps {
  state: GameState;
  onStartLevel: (level: number) => void;
  onNavigate: (screen: GameState['currentScreen']) => void;
}

const LEVEL_DATA = [
  { id: 1, title: 'Basic Identification', description: 'Investigate standard hospital claims and verify active split billing setup.' },
  { id: 2, title: 'SPLITBL Not Applicable', description: 'Analyze physician claims where split billing rules do not apply.' },
  { id: 3, title: 'SB Field Interpretation', description: 'Verify facility configuration using MHI screen SB field indicators.' },
  { id: 4, title: 'Ambulance Exclusion Rule', description: 'Audit ambulance services excluded from standard split billing rules.' },
  { id: 5, title: 'Multiple Rule Advanced', description: 'Evaluate complex cases involving multiple rules and HCPCS exclusions.' },
];

export default function StartScreen({ state, onStartLevel, onNavigate }: StartScreenProps) {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 4000);
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate stats from state
  const completedLevels = state.levelResults.length;
  const totalQuestions = state.levelResults.reduce((sum, r) => sum + r.totalQuestions, 0);
  const correctAnswers = state.levelResults.reduce((sum, r) => sum + r.correctAnswers, 0);
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  const totalTime = state.levelResults.reduce((sum, r) => sum + r.time, 0);
  const avgTimeSeconds = completedLevels > 0 ? Math.round(totalTime / completedLevels) : 0;
  const avgTime = `${Math.floor(avgTimeSeconds / 60).toString().padStart(2, '0')}:${(avgTimeSeconds % 60).toString().padStart(2, '0')}`;

  const levelsWithStatus = LEVEL_DATA.map(lvl => {
    const result = state.levelResults.find(r => r.level === lvl.id);
    const isUnlocked = state.unlockedLevels.includes(lvl.id);
    
    let status: 'completed' | 'progress' | 'locked' | 'default' = 'default';
    if (result) status = 'completed';
    else if (!isUnlocked) status = 'locked';
    else if (lvl.id === state.currentLevel) status = 'progress';

    return { ...lvl, status };
  });

  const userStats = {
    score: state.totalScore || 0,
    accuracy,
    completedCount: completedLevels,
    avgTime
  };

  return (
    <>
    <AppDashboard 
      userStats={userStats}
      levels={levelsWithStatus}
      onLevelSelect={onStartLevel}
      onStartShift={() => onNavigate('roleBriefing')}
      onNavigate={onNavigate}
    />
    
    <StartSimulationModal
      visible={showWelcome}
      onEnterGame={() => {
        setShowWelcome(false);
        onNavigate('roleBriefing');
      }}
      onHowToPlay={() => {
        setShowWelcome(false);
        onNavigate('howToPlay');
      }}
      onClose={() => setShowWelcome(false)}
    />
    </>
  );
}
