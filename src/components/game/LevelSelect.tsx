import { motion } from 'framer-motion';
import { Lock, Star, ArrowLeft, Shield, ChevronRight, Zap } from 'lucide-react';
import { LEVEL_TITLES, LEVEL_FORMATS } from '@/types/game';
import ParticleField from './ParticleField';

interface LevelSelectProps {
  unlockedLevels: number[];
  starRatings: Record<number, number>;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const LEVEL_ICONS = ['🔍', '🧩', '💻', '⚡', '🎯'];
const LEVEL_DIFFICULTY = ['ROOKIE', 'AGENT', 'SPECIALIST', 'EXPERT', 'COMMANDER'];
const DIFFICULTY_COLORS = ['text-success', 'text-success', 'text-warning', 'text-warning', 'text-destructive'];

export default function LevelSelect({ unlockedLevels, starRatings, onSelectLevel, onBack }: LevelSelectProps) {
  return (
    <div className="min-h-screen relative overflow-hidden animated-gradient">
      <ParticleField />
      <div className="absolute inset-0 grid-bg pointer-events-none z-[1]" />

      {/* Top bar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-border/50 bg-card/50 backdrop-blur-sm"
      >
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition font-mono text-xs">
          <ArrowLeft size={14} /> ABORT MISSION
        </button>
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-primary" />
          <span className="font-mono text-xs text-muted-foreground tracking-widest">MISSION SELECT</span>
        </div>
      </motion.div>

      <div className="relative z-10 p-6 md:p-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 bg-primary/20" />
            <h2 className="text-3xl md:text-4xl font-heading font-black text-primary text-glow tracking-tight">SELECT MISSION</h2>
            <div className="h-px flex-1 bg-primary/20" />
          </div>
          <p className="text-muted-foreground font-mono text-sm text-center">
            Choose your investigation level • Complete missions to unlock the next
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
                    stars > 0 ? 'bg-primary border-primary' : unlocked ? 'border-primary/50 bg-transparent' : 'border-border bg-transparent'
                  }`} />
                )}
              </div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5].map((level, i) => {
            const unlocked = unlockedLevels.includes(level);
            const stars = starRatings[level] || 0;
            return (
              <motion.button
                key={level}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 100 }}
                disabled={!unlocked}
                onClick={() => unlocked && onSelectLevel(level)}
                className={`group relative text-left rounded-xl overflow-hidden transition-all duration-300 ${
                  unlocked
                    ? 'cursor-pointer hover:scale-[1.03]'
                    : 'cursor-not-allowed opacity-40'
                }`}
              >
                {/* Card bg */}
                <div className={`absolute inset-0 ${unlocked ? 'bg-card/90 backdrop-blur-sm' : 'bg-card/50'}`} />
                <div className={`absolute inset-0 transition-opacity duration-300 ${unlocked ? 'group-hover:opacity-100 opacity-0' : 'opacity-0'}`}
                  style={{ boxShadow: 'inset 0 0 40px hsl(163 100% 50% / 0.05)' }} />

                {/* Border */}
                <div className={`absolute inset-0 rounded-xl border transition-all duration-300 ${
                  unlocked ? 'border-border group-hover:border-primary/50 group-hover:shadow-[0_0_20px_hsl(163_100%_50%/0.15)]' : 'border-border/30'
                }`} />

                {/* Lock overlay */}
                {!unlocked && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-[2px] rounded-xl">
                    <Lock size={36} className="text-muted-foreground/40" />
                  </div>
                )}

                <div className="relative z-10 p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{LEVEL_ICONS[i]}</span>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${
                      unlocked ? `bg-secondary ${DIFFICULTY_COLORS[i]}` : 'bg-secondary/50 text-muted-foreground'
                    }`}>
                      <Zap size={10} />
                      {LEVEL_DIFFICULTY[i]}
                    </div>
                  </div>

                  <span className="text-xs font-mono text-primary/60 uppercase tracking-widest">LEVEL {level}</span>
                  <h3 className="text-lg font-heading font-bold text-foreground mt-1 mb-1 group-hover:text-primary transition-colors">
                    {LEVEL_TITLES[level]}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground mb-4">{LEVEL_FORMATS[level]}</p>

                  {/* Stars + Arrow */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          size={16}
                          className={s <= stars ? 'text-warning fill-warning drop-shadow-[0_0_4px_hsl(42_100%_50%/0.5)]' : 'text-muted-foreground/20'}
                        />
                      ))}
                    </div>
                    {unlocked && (
                      <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
