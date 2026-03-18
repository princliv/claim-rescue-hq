import { motion } from 'framer-motion';
import { Clock, Lightbulb, Star, Shield, Activity } from 'lucide-react';

interface GameHUDProps {
  level: number;
  title: string;
  score: number;
  timeLeft: number;
  hintsLeft: number;
  onHint: () => void;
}

export default function GameHUD({ level, title, score, timeLeft, hintsLeft, onHint }: GameHUDProps) {
  const isLow = timeLeft < 20;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = (timeLeft / 90) * 100;

  return (
    <div className="relative sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3 glass-panel">
        {/* Left - level info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary/5 border border-primary/20">
            <Activity size={14} className="text-primary" />
            <span className="text-xs font-mono text-primary font-bold">CASE {level}</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <span className="hidden sm:block text-sm font-heading font-medium text-foreground">{title}</span>
        </div>

        {/* Right - stats */}
        <div className="flex items-center gap-3">
          {/* Hints */}
          <motion.button
            whileHover={{ scale: hintsLeft > 0 ? 1.03 : 1 }}
            whileTap={{ scale: hintsLeft > 0 ? 0.97 : 1 }}
            onClick={onHint}
            disabled={hintsLeft === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
              hintsLeft > 0
                ? 'bg-warning/10 text-warning border border-warning/30 hover:bg-warning/15'
                : 'bg-secondary text-muted-foreground/50 border cursor-not-allowed'
            }`}
          >
            <Lightbulb size={14} />
            <span className="font-bold">{hintsLeft}</span>
          </motion.button>

          {/* Score */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
            <Star size={14} className="text-primary" />
            <motion.span
              key={score}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="font-mono text-sm font-bold text-primary"
            >
              {score}
            </motion.span>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-sm font-bold transition-all ${
            isLow
              ? 'bg-destructive/10 text-destructive border border-destructive/20'
              : 'bg-secondary text-foreground border'
          }`}>
            <Clock size={14} />
            {mins}:{secs.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Timer progress bar */}
      <div className="h-0.5 bg-secondary">
        <motion.div
          className={`h-full transition-all duration-1000 ${isLow ? 'bg-destructive' : 'bg-primary'}`}
          style={{ width: `${progress}%` }}
          layout
        />
      </div>
    </div>
  );
}
