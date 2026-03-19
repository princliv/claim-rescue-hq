import React from 'react';
import { motion } from 'framer-motion';
import { MdTimer, MdLightbulbOutline, MdStar, MdOutlineSecurity, MdOutlineAnalytics, MdInfoOutline } from 'react-icons/md';

interface GameHUDProps {
  level: number;
  title: string;
  score: number;
  timeLeft: number;
  hintsLeft: number;
  onHint: () => void;
  onHelp?: () => void;
}

export default function GameHUD({ level, title, score, timeLeft, hintsLeft, onHint, onHelp }: GameHUDProps) {
  const isLow = timeLeft < 20;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = (timeLeft / 90) * 100;

  return (
    <div className="relative sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/60 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        {/* Left - Phase & Case info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
            <MdOutlineAnalytics size={18} className="animate-pulse" />
            <span className="text-[10px] font-mono font-black tracking-widest leading-none">PHASE 0{level}</span>
          </div>
          
          {onHelp && (
            <button 
              onClick={onHelp}
              className="w-8 h-8 rounded-full bg-white/5 text-slate-400 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 transition-all group border border-white/5"
              title="How to play this level"
            >
              <MdInfoOutline size={18} />
            </button>
          )}

          <div className="h-4 w-px bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Investigation Case</span>
            <span className="text-sm font-heading font-black text-white tracking-tight leading-none uppercase">{title}</span>
          </div>
        </div>

        {/* Right - System Metrics */}
        <div className="flex items-center gap-4">
          {/* Hints / Assistance */}
          <motion.button
            whileHover={hintsLeft > 0 ? { scale: 1.05, y: -2 } : {}}
            whileTap={hintsLeft > 0 ? { scale: 0.95 } : {}}
            onClick={onHint}
            disabled={hintsLeft === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all border-2 ${
              hintsLeft > 0
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40'
                : 'bg-slate-800 text-slate-500 border-white/5 cursor-not-allowed opacity-50'
            }`}
          >
            <MdLightbulbOutline size={16} />
            <span className="font-black text-[11px]">{hintsLeft} ANALYTIC HINTS</span>
          </motion.button>

          {/* Performance Score */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border-2 border-blue-500/20">
            <MdStar size={18} className="text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[8px] font-mono font-bold text-blue-400/60 uppercase leading-none mb-1">Score Matrix</span>
              <motion.span
                key={score}
                initial={{ scale: 1.5, color: '#60a5fa' }}
                animate={{ scale: 1, color: '#60a5fa' }}
                className="font-mono text-xs font-black leading-none text-blue-400"
              >
                {score.toString().padStart(4, '0')}
              </motion.span>
            </div>
          </div>

          {/* Precision Timer */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl font-mono transition-all border-2 ${
            isLow
              ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
              : 'bg-slate-900 text-white border-transparent shadow-lg'
          }`}>
            <MdTimer size={18} />
            <div className="flex flex-col">
              <span className={`text-[8px] font-mono font-bold uppercase leading-none mb-1 ${isLow ? 'text-rose-400' : 'text-slate-400'}`}>T-Minus</span>
              <span className="text-xs font-black leading-none">
                {mins}:{secs.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistence Bar */}
      <div className="h-1 bg-white/5">
        <motion.div
          className={`h-full transition-all duration-1000 ${isLow ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
