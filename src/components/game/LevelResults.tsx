import { motion } from 'framer-motion';
import { LevelResult, LEVEL_TITLES } from '@/types/game';
import { RotateCcw, ArrowRight, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

interface Props {
  result: LevelResult;
  onNext: () => void;
  onRetry: () => void;
  isLastLevel: boolean;
}

export default function LevelResults({ result, onNext, onRetry, isLastLevel }: Props) {
  const accuracy = result.totalQuestions > 0
    ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
    : 0;

  const badge = accuracy >= 90
    ? { label: 'Senior Analyst', color: 'text-success', emoji: '✅' }
    : accuracy >= 60
      ? { label: 'Associate Analyst', color: 'text-warning', emoji: '🟡' }
      : { label: 'Junior Analyst', color: 'text-destructive', emoji: '⚠️' };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white border rounded-xl p-8 max-w-md w-full shadow-sm"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-5xl mb-3"
          >
            {badge.emoji}
          </motion.div>

          <h2 className="text-xl font-heading font-bold text-foreground mb-0.5">Case {result.level} Analysis Complete</h2>
          <p className="text-xs font-mono text-muted-foreground mb-2">{LEVEL_TITLES[result.level]}</p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-base font-heading font-semibold ${badge.color} mb-6`}
          >
            {badge.label}
          </motion.p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Zap, label: 'Score', value: String(result.score), color: 'text-primary' },
            { icon: Clock, label: 'Time', value: `${result.time}s`, color: 'text-foreground' },
            { icon: CheckCircle, label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 60 ? 'text-success' : 'text-destructive' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-secondary/50 border rounded-lg p-3 text-center"
            >
              <stat.icon size={16} className={`mx-auto mb-1 ${stat.color}`} />
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-lg font-mono font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between px-3 py-2 bg-secondary/30 rounded-lg mb-6 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle size={12} className="text-success" /> {result.correctAnswers} correct</span>
          <span className="flex items-center gap-1"><XCircle size={12} className="text-destructive" /> {result.totalQuestions - result.correctAnswers} wrong</span>
          <span>💡 {result.hintsUsed} hints</span>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-foreground rounded-lg font-heading font-medium border hover:bg-secondary/50 transition-colors"
          >
            <RotateCcw size={16} /> Retry
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-heading font-semibold shadow-sm"
          >
            {isLastLevel ? 'Results' : 'Next'} <ArrowRight size={16} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
