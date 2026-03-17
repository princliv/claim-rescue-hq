import { AnimatePresence, motion } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import StartScreen from '@/components/game/StartScreen';
import LevelSelect from '@/components/game/LevelSelect';
import LevelResults from '@/components/game/LevelResults';
import FinalDashboard from '@/components/game/FinalDashboard';
import Level1Detective from '@/components/game/Level1Detective';
import Level2DragDrop from '@/components/game/Level2DragDrop';
import Level3Terminal from '@/components/game/Level3Terminal';
import Level4Comparison from '@/components/game/Level4Comparison';
import Level5SplitScreen from '@/components/game/Level5SplitScreen';

const Index = () => {
  const { state, navigate, startLevel, completeLevel, resetGame } = useGameState();

  const renderLevel = () => {
    switch (state.currentLevel) {
      case 1: return <Level1Detective onComplete={completeLevel} />;
      case 2: return <Level2DragDrop onComplete={completeLevel} />;
      case 3: return <Level3Terminal onComplete={completeLevel} />;
      case 4: return <Level4Comparison onComplete={completeLevel} />;
      case 5: return <Level5SplitScreen onComplete={completeLevel} />;
      default: return null;
    }
  };

  const currentResult = state.levelResults.find(r => r.level === state.currentLevel);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div key={state.currentScreen + state.currentLevel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {state.currentScreen === 'start' && (
            <StartScreen bestScore={state.bestScore} onStart={() => navigate('levelSelect')} />
          )}
          {state.currentScreen === 'levelSelect' && (
            <LevelSelect
              unlockedLevels={state.unlockedLevels}
              starRatings={state.starRatings}
              onSelectLevel={startLevel}
              onBack={() => navigate('start')}
            />
          )}
          {state.currentScreen === 'gameplay' && renderLevel()}
          {state.currentScreen === 'levelResults' && currentResult && (
            <LevelResults
              result={currentResult}
              isLastLevel={state.currentLevel === 5}
              onNext={() => {
                if (state.currentLevel === 5 && state.levelResults.length === 5) {
                  navigate('finalDashboard');
                } else {
                  startLevel(state.currentLevel + 1);
                }
              }}
              onRetry={() => startLevel(state.currentLevel)}
            />
          )}
          {state.currentScreen === 'finalDashboard' && (
            <FinalDashboard results={state.levelResults} totalScore={state.totalScore} onPlayAgain={resetGame} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Index;
