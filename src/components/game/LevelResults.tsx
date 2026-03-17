import { motion } from 'framer-motion';
import { LevelResult, LEVEL_TITLES } from '@/types/game';
import { RotateCcw, ArrowRight, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import ParticleField from './ParticleField';

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
    ? { label: 'EXPERT', color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', emoji: '🟢', glow: 'text-glow-success' }
    : accuracy >= 60
      ? { label: 'INTERMEDIATE', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', emoji: '🟡', glow: 'text-glow-warning' }
      : { label: 'BEGINNER', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', emoji: '🔴', glow: 'text-glow-danger' };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden animated-gradient">
      <ParticleField />
      <div className="absolute inset-0 grid-bg pointer-events-none z-[1]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="relative z-10 bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-8 max-w-md w-full corner-brackets"
      >
        {/* Decorative top line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-6xl mb-3"
          >
            {badge.emoji}
          </motion.div>

          <h2 className="text-xl font-heading font-bold text-foreground mb-0.5">Level {result.level} Complete</h2>
          <p className="text-xs font-mono text-muted-foreground mb-2">{LEVEL_TITLES[result.level]}</p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-lg font-heading font-bold ${badge.color} ${badge.glow} mb-6`}
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
              className="bg-secondary/50 border border-border rounded-xl p-3 text-center"
            >
              <stat.icon size={16} className={`mx-auto mb-1 ${stat.color}`} />
              <p className="text-xs font-mono text-muted-foreground">{stat.label}</p>
              <p className={`text-xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Details */}
        <div className="flex items-center justify-between px-3 py-2 bg-secondary/30 rounded-lg mb-6 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle size={12} className="text-success" /> {result.correctAnswers} correct</span>
          <span className="flex items-center gap-1"><XCircle size={12} className="text-destructive" /> {result.totalQuestions - result.correctAnswers} wrong</span>
          <span>💡 {result.hintsUsed} hints</span>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-secondary text-foreground rounded-xl font-heading font-semibold neon-border hover:box-glow transition-all"
          >
            <RotateCcw size={16} /> Retry
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px hsl(163 100% 50% / 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground rounded-xl font-heading font-bold box-glow-strong"
          >
            {isLastLevel ? 'Results' : 'Next'} <ArrowRight size={16} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
