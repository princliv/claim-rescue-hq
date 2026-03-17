import { motion } from 'framer-motion';
import { Clock, Lightbulb, Star, Shield, Crosshair } from 'lucide-react';

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
    <div className="relative">
      {/* Main HUD */}
      <div className="flex items-center justify-between px-6 py-3 bg-card/90 backdrop-blur-sm border-b border-border">
        {/* Left - level info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 neon-border">
            <Crosshair size={14} className="text-primary" />
            <span className="text-xs font-mono text-primary font-bold">LVL {level}</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <span className="hidden sm:block text-sm font-heading font-semibold text-foreground">{title}</span>
        </div>

        {/* Right - stats */}
        <div className="flex items-center gap-3">
          {/* Hints */}
          <motion.button
            whileHover={{ scale: hintsLeft > 0 ? 1.05 : 1 }}
            whileTap={{ scale: hintsLeft > 0 ? 0.95 : 1 }}
            onClick={onHint}
            disabled={hintsLeft === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
              hintsLeft > 0
                ? 'bg-warning/10 text-warning border border-warning/30 hover:border-warning/60 hover:bg-warning/20'
                : 'bg-secondary/50 text-muted-foreground/50 border border-border/50 cursor-not-allowed'
            }`}
          >
            <Lightbulb size={14} />
            <span className="font-bold">{hintsLeft}</span>
          </motion.button>

          {/* Score */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 neon-border">
            <Star size={14} className="text-primary" />
            <motion.span
              key={score}
              initial={{ scale: 1.4, color: 'hsl(163 100% 50%)' }}
              animate={{ scale: 1, color: 'hsl(163 100% 50%)' }}
              className="font-mono text-sm font-bold text-primary"
            >
              {score}
            </motion.span>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-sm font-bold transition-all ${
            isLow
              ? 'bg-destructive/15 text-destructive border border-destructive/30 animate-pulse neon-border-danger'
              : 'bg-secondary text-foreground border border-border'
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
