import { motion } from 'framer-motion';
import { LevelResult, LEVEL_TITLES } from '@/types/game';
import { RotateCcw, Copy, Check, Trophy, Star, TrendingUp, CheckCircle, Activity, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    ? { label: 'Certified Senior Analyst', color: 'text-success', icon: <CheckCircle size={48} className="text-success drop-shadow-sm" /> }
    : totalScore >= 300
      ? { label: 'Certified Associate', color: 'text-warning', icon: <Activity size={48} className="text-warning drop-shadow-sm" /> }
      : { label: 'Junior Analyst', color: 'text-destructive', icon: <AlertTriangle size={48} className="text-destructive drop-shadow-sm" /> };

  const shareScore = () => {
    navigator.clipboard.writeText(`Claim Rescue Score: ${totalScore}/600 — ${badge.label}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80 }}
        className="bg-white border rounded-xl p-8 max-w-2xl w-full shadow-sm"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 font-mono text-xs text-primary mb-4"
          >
            <Trophy size={12} /> Training Program Complete
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
            className="text-5xl mb-3"
          >
            {badge.icon}
          </motion.div>

          <p className={`text-lg font-heading font-semibold ${badge.color} mb-4`}>{badge.label}</p>

          <div className="flex items-center justify-center gap-2">
            <motion.span className="font-mono text-4xl font-black text-primary">
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
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left py-3 px-4 text-muted-foreground text-xs font-medium">Case Study</th>
                <th className="text-center py-3 px-4 text-muted-foreground text-xs font-medium">Score</th>
                <th className="text-center py-3 px-4 text-muted-foreground text-xs font-medium">Time</th>
                <th className="text-center py-3 px-4 text-muted-foreground text-xs font-medium">Evaluation</th>
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
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="border-t hover:bg-secondary/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-foreground text-xs font-medium">{LEVEL_TITLES[lvl]}</td>
                    <td className="py-3 px-4 text-center text-primary font-bold font-mono">{r?.score ?? '-'}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground font-mono">{r ? `${r.time}s` : '-'}</td>
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={shareScore}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-foreground rounded-lg font-heading font-medium border hover:bg-secondary/50 transition-colors"
          >
            {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Share Score'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-heading font-semibold shadow-sm"
          >
            <RotateCcw size={16} /> Play Again
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
