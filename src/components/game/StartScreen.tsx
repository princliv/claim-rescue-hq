import { motion } from 'framer-motion';
import { Rocket, BookOpen, Trophy, Shield, Zap, Target, Activity, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import HowToPlayModal from './HowToPlayModal';
import ParticleField from './ParticleField';
import RadarWidget from './RadarWidget';

interface StartScreenProps {
  bestScore: number;
  onStart: () => void;
}

const stats = [
  { label: 'CASES PENDING', value: '5', icon: AlertTriangle, color: 'text-warning' },
  { label: 'THREAT LEVEL', value: 'HIGH', icon: Zap, color: 'text-destructive' },
  { label: 'SYSTEMS', value: 'ONLINE', icon: Activity, color: 'text-success' },
];

export default function StartScreen({ bestScore, onStart }: StartScreenProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden animated-gradient">
      {/* Background layers */}
      <ParticleField />
      <div className="absolute inset-0 scanline pointer-events-none z-[1]" />
      <div className="absolute inset-0 grid-bg pointer-events-none z-[1]" />

      {/* Top HUD bar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-border/50 bg-card/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <Shield size={16} className="text-primary" />
          <span className="font-mono text-xs text-muted-foreground tracking-widest">MEDICARE CLAIMS DIVISION</span>
          <div className="status-dot ml-2" />
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">SYS_STATUS: <span className="text-success">OPERATIONAL</span></span>
          <span className="font-mono text-xs text-muted-foreground">SEC_LVL: <span className="text-warning">CLASSIFIED</span></span>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl w-full">
          
          {/* Left side - Title and actions */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 neon-border text-primary font-mono text-xs mb-6"
            >
              <Target size={12} />
              CLASSIFIED MISSION BRIEFING
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-primary text-glow tracking-tighter mb-1 leading-none"
            >
              CLAIM
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-foreground tracking-tighter mb-4 leading-none"
            >
              RESCUE
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 mb-8 justify-center lg:justify-start"
            >
              <div className="h-px flex-1 max-w-[60px] bg-primary/30" />
              <p className="font-mono text-sm text-muted-foreground tracking-wide">
                LCD/NCD Challenge — Are you ready for your shift?
              </p>
              <div className="h-px flex-1 max-w-[60px] bg-primary/30" />
            </motion.div>

            {bestScore > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card neon-border text-primary font-mono text-sm mb-8 corner-brackets"
              >
                <Trophy size={16} className="text-warning" />
                BEST SCORE: {bestScore}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px hsl(163 100% 50% / 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="group relative flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-heading font-bold text-lg rounded-xl box-glow-strong overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <Rocket size={22} />
                Start Shift
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-2 px-8 py-5 bg-card text-foreground font-heading font-semibold rounded-xl neon-border hover:box-glow transition-all"
              >
                <BookOpen size={18} />
                How to Play
              </motion.button>
            </motion.div>
          </div>

          {/* Right side - Dashboard widgets */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="hidden lg:flex flex-col gap-4 w-[320px]"
          >
            {/* Radar */}
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 corner-brackets">
              <div className="flex items-center gap-2 mb-3">
                <div className="status-dot" />
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Threat Scanner</span>
              </div>
              <div className="flex justify-center">
                <RadarWidget size={140} />
              </div>
            </div>

            {/* Stats row */}
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 flex items-center gap-3 hover:neon-border transition-all"
              >
                <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon size={16} />
                </div>
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{stat.label}</p>
                  <p className={`font-mono text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 flex items-center justify-between px-6 py-3 border-t border-border/50 bg-card/30 backdrop-blur-sm"
      >
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs text-muted-foreground">v2.4.1</span>
          <span className="font-mono text-xs text-primary/50">■■■■■■■■ ENCRYPTED</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">5 LEVELS</span>
          <span className="font-mono text-xs text-muted-foreground">|</span>
          <span className="font-mono text-xs text-muted-foreground">600 MAX SCORE</span>
          <span className="font-mono text-xs text-muted-foreground">|</span>
          <span className="font-mono text-xs text-success">READY</span>
        </div>
      </motion.div>

      <HowToPlayModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
