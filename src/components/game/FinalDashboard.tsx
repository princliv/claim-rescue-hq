import { motion } from 'framer-motion';
import { LevelResult, LEVEL_TITLES } from '@/types/game';
import { RotateCcw, Copy, Check, Trophy, Star, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import ParticleField from './ParticleField';

interface Props {
  results: LevelResult[];
  totalScore: number;
  onPlayAgain: () => void;
}

export default function FinalDashboard({ results, totalScore, onPlayAgain }: Props) {
  const [displayScore, setDisplayScore] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let frame: number;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.floor(eased * totalScore));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [totalScore]);

  const badge = totalScore >= 500
    ? { label: 'EXPERT ANALYST', color: 'text-success', emoji: '🟢', glow: 'text-glow-success', ring: 'border-success/50' }
    : totalScore >= 300
      ? { label: 'INTERMEDIATE ANALYST', color: 'text-warning', emoji: '🟡', glow: 'text-glow-warning', ring: 'border-warning/50' }
      : { label: 'BEGINNER ANALYST', color: 'text-destructive', emoji: '🔴', glow: 'text-glow-danger', ring: 'border-destructive/50' };

  const shareScore = () => {
    navigator.clipboard.writeText(`🏆 Claim Rescue Score: ${totalScore}/600 — ${badge.label}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden animated-gradient">
      <ParticleField />
      <div className="absolute inset-0 grid-bg pointer-events-none z-[1]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80 }}
        className="relative z-10 bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-8 max-w-2xl w-full"
      >
        {/* Top decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-2xl" />

        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 neon-border font-mono text-xs text-primary mb-4"
          >
            <Trophy size={12} /> MISSION COMPLETE
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
            className={`w-24 h-24 rounded-full border-4 ${badge.ring} flex items-center justify-center mx-auto mb-4`}
          >
            <span className="text-5xl">{badge.emoji}</span>
          </motion.div>

          <p className={`text-xl font-heading font-bold ${badge.color} ${badge.glow} mb-4`}>{badge.label}</p>

          <div className="flex items-center justify-center gap-2">
            <motion.span
              className="font-mono text-5xl font-black text-primary text-glow"
            >
              {displayScore}
            </motion.span>
            <span className="text-muted-foreground text-xl font-mono">/600</span>
          </div>

          {/* Score bar */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(totalScore / 600) * 100}%` }}
                transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
                style={{ boxShadow: '0 0 10px hsl(163 100% 50% / 0.4)' }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border mb-6">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left py-3 px-4 text-muted-foreground text-xs font-medium">MISSION</th>
                <th className="text-center py-3 px-4 text-muted-foreground text-xs font-medium">SCORE</th>
                <th className="text-center py-3 px-4 text-muted-foreground text-xs font-medium">TIME</th>
                <th className="text-center py-3 px-4 text-muted-foreground text-xs font-medium">RATING</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((lvl, i) => {
                const r = results.find(x => x.level === lvl);
                const acc = r ? Math.round((r.correctAnswers / r.totalQuestions) * 100) : 0;
                const stars = acc >= 90 ? 3 : acc >= 60 ? 2 : r ? 1 : 0;
                return (
                  <motion.tr
                    key={lvl}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="border-t border-border/50 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-foreground text-xs">{LEVEL_TITLES[lvl]}</td>
                    <td className="py-3 px-4 text-center text-primary font-bold">{r?.score ?? '-'}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{r ? `${r.time}s` : '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-0.5 justify-center">
                        {[1, 2, 3].map(s => (
                          <Star key={s} size={12} className={s <= stars ? 'text-warning fill-warning' : 'text-muted-foreground/20'} />
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareScore}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-secondary text-foreground rounded-xl font-heading font-semibold neon-border hover:box-glow transition-all"
          >
            {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Share Score'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px hsl(163 100% 50% / 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground rounded-xl font-heading font-bold box-glow-strong"
          >
            <RotateCcw size={16} /> Play Again
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
