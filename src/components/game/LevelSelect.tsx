import { motion } from 'framer-motion';
import { Lock, Star, ArrowLeft, Shield, ChevronRight, Zap } from 'lucide-react';
import { LEVEL_TITLES, LEVEL_FORMATS } from '@/types/game';

interface LevelSelectProps {
  unlockedLevels: number[];
  starRatings: Record<number, number>;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const LEVEL_ICONS = ['📋', '🔬', '🏥', '📊', '👨‍⚕️'];
const LEVEL_DIFFICULTY = ['Junior', 'Analyst', 'Senior', 'Expert', 'Specialist'];
const DIFFICULTY_COLORS = ['text-success', 'text-success', 'text-warning', 'text-warning', 'text-destructive'];

export default function LevelSelect({ unlockedLevels, starRatings, onSelectLevel, onBack }: LevelSelectProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-6 py-3 border-b bg-white"
      >
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition font-mono text-xs">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-primary" />
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Simulation Select</span>
        </div>
      </motion.div>

      <div className="p-6 md:p-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight text-center">Select Case</h2>
          <p className="text-muted-foreground text-sm text-center mt-2">
            Choose your analytical case • Complete simulations to unlock the next
          </p>
        </motion.div>

        {/* Level progress bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1 mb-10 max-w-2xl mx-auto"
        >
          {[1, 2, 3, 4, 5].map((level) => {
            const unlocked = unlockedLevels.includes(level);
            const stars = starRatings[level] || 0;
            return (
              <div key={level} className="flex-1 flex items-center">
                <div className={`w-full h-1.5 rounded-full ${stars > 0 ? 'bg-primary' : unlocked ? 'bg-primary/30' : 'bg-border'}`} />
                {level < 5 && (
                  <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 mx-1 ${
                    stars > 0 ? 'bg-primary border-primary' : unlocked ? 'border-primary/40 bg-transparent' : 'border-border bg-transparent'
                  }`} />
                )}
              </div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((level, i) => {
            const unlocked = unlockedLevels.includes(level);
            const stars = starRatings[level] || 0;
            return (
              <motion.button
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                disabled={!unlocked}
                onClick={() => unlocked && onSelectLevel(level)}
                className={`group relative text-left rounded-lg border bg-white p-5 transition-all duration-200 ${
                  unlocked
                    ? 'cursor-pointer hover:shadow-md hover:border-primary/30'
                    : 'cursor-not-allowed opacity-50'
                }`}
              >
                {/* Lock overlay */}
                {!unlocked && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 rounded-lg">
                    <Lock size={28} className="text-muted-foreground/40" />
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{LEVEL_ICONS[i]}</span>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${
                      unlocked ? `bg-secondary ${DIFFICULTY_COLORS[i]}` : 'bg-secondary/50 text-muted-foreground'
                    }`}>
                      <Zap size={10} />
                      {LEVEL_DIFFICULTY[i]}
                    </div>
                  </div>

                  <span className="text-xs font-mono text-primary/60 uppercase tracking-widest">Level {level}</span>
                  <h3 className="text-base font-heading font-semibold text-foreground mt-1 mb-1 group-hover:text-primary transition-colors">
                    {LEVEL_TITLES[level]}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground mb-4">{LEVEL_FORMATS[level]}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= stars ? 'text-warning fill-warning' : 'text-muted-foreground/20'}
                        />
                      ))}
                    </div>
                    {unlocked && (
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
