import React from 'react';
import { motion } from 'framer-motion';
import { MdPlayCircleOutline, MdTrendingUp, MdRule, MdTimeline } from 'react-icons/md';

interface HeroProps {
  score: number;
  accuracy: number;
  completedCount: number;
  onStartShift: () => void;
}

export default function DashboardHero({ score, accuracy, completedCount, onStartShift }: HeroProps) {
  return (
    <section className="hero-section">
      {/* Abstract Background Patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <svg className="absolute -right-20 -top-20 text-white" width="400" height="400" fill="none" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 10" />
          <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="1" />
          <path d="M200 50 L200 350 M50 200 L350 200" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </div>

      <div className="hero-left relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-black tracking-tight"
        >
          Split Bill Detective
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="uppercase tracking-[0.5em] text-[10px] font-black text-blue-200 mb-6"
        >
          Advanced CAS Simulation Environment
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-blue-50/70 text-sm leading-relaxed max-w-lg mb-8 font-medium"
        >
          Execute complex facility audits with high-fidelity system queries.
          Identify mandatory split billing logic and resolve discrepancies in a specialized clinical environment.
        </motion.p>
      </div>

      <div className="hero-right">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-blue-600/70 mb-1">
                  <MdTrendingUp size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none">Record Score</span>
                </div>
                <span className="text-3xl font-black tabular-nums text-slate-900">{score} <small className="text-xs text-slate-400 font-medium tracking-normal">pts</small></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-blue-600/70 mb-1">
                  <MdRule size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none">Accuracy</span>
                </div>
                <span className="text-3xl font-black tabular-nums text-slate-900">{accuracy}%</span>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-blue-600/70 mb-1">
                  <MdTimeline size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none">Progress</span>
                </div>
                <span className="text-lg font-black uppercase text-slate-900">{completedCount}/5 Levels</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStartShift}
                className="cta-button cta-primary flex items-center justify-center gap-3 group"
              >
                <span className="relative z-10">Start Investigation</span>
                <MdPlayCircleOutline size={20} className="relative z-10 group-hover:rotate-12 transition-transform" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
