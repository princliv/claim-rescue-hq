import React from 'react';
import { motion } from 'framer-motion';
import { LEVEL_TITLES, LEVEL_FORMATS } from '@/types/game';
import section1Bg from '@/assets/bg_section1.png';

// React Icons Imports
import { 
  MdLockOutline, 
  MdStar, 
  MdArrowBack, 
  MdOutlineSecurity, 
  MdChevronRight, 
  MdCheckCircle,
  MdScience 
} from 'react-icons/md';
import { 
  BsLightningFill, 
  BsJournalMedical, 
  BsHospital, 
  BsBarChartFill, 
  BsPersonBadgeFill 
} from 'react-icons/bs';

interface LevelSelectProps {
  unlockedLevels: number[];
  starRatings: Record<number, number>;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const LEVEL_ICONS = [
  <BsJournalMedical key="0" />, 
  <MdScience key="1" />, 
  <BsHospital key="2" />, 
  <BsBarChartFill key="3" />, 
  <BsPersonBadgeFill key="4" />
];
const LEVEL_DIFFICULTY = ['Junior', 'Analyst', 'Senior', 'Expert', 'Specialist'];
const DIFFICULTY_COLORS = ['text-emerald-600', 'text-blue-600', 'text-amber-600', 'text-orange-600', 'text-rose-600'];
const DIFFICULTY_BGS = ['bg-emerald-50', 'bg-blue-50', 'bg-amber-50', 'bg-orange-50', 'bg-rose-50'];

export default function LevelSelect({ unlockedLevels, starRatings, onSelectLevel, onBack }: LevelSelectProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fafbfc] font-sans">
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40 mix-blend-overlay scale-110"
        style={{ backgroundImage: `url(${section1Bg})` }}
      />
      <div className="absolute inset-0 bg-white/40 z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top bar - High Contrast */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between px-8 py-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50"
        >
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary transition-all font-mono text-[11px] font-bold uppercase tracking-widest group">
            <MdArrowBack size={18} className="group-hover:-translate-x-1 transition-transform" /> BACK TO HEADQUARTERS
          </button>
          <div className="flex items-center gap-3">
            <MdOutlineSecurity size={20} className="text-primary" />
            <div className="h-4 w-px bg-slate-200" />
            <span className="font-mono text-[10px] text-slate-400 tracking-[0.4em] uppercase">Phase Selection Dashboard</span>
          </div>
        </motion.div>

        <div className="p-8 md:p-16 max-w-7xl mx-auto flex-1 w-full text-foreground">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-16 text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary text-white font-mono text-[9px] font-bold mb-6 tracking-[0.2em]">
              <BsLightningFill size={10} /> COMMAND CENTER
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-slate-900 tracking-tight leading-none mb-6">Select Case File</h2>
            <p className="text-slate-500 text-sm md:text-base font-mono opacity-80 leading-relaxed capitalize">
              Operational readiness check: select an analytical simulation from the sequence to initialize.
            </p>
          </motion.div>

          {/* Premium Progress Tracker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-0 mb-20 max-w-4xl mx-auto relative px-8"
          >
            {[1, 2, 3, 4, 5].map((level, idx) => {
              const unlocked = unlockedLevels.includes(level);
              const stars = starRatings[level] || 0;
              const isLast = idx === 4;
              
              return (
                <div key={level} className={`flex-1 flex items-center ${isLast ? 'flex-none' : ''}`}>
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 transition-all duration-500 border-2 shadow-sm ${
                      stars > 0 
                        ? 'border-primary bg-primary text-white shadow-primary/20 scale-110' 
                        : unlocked 
                          ? 'border-primary bg-white text-primary' 
                          : 'border-slate-200 bg-white text-slate-300'
                    }`}
                  >
                    {stars > 0 ? <MdCheckCircle size={24} /> : <span className="text-sm font-black">{level}</span>}
                  </div>
                  {!isLast && (
                    <div className="flex-1 h-1 mx-[-2px] relative z-0">
                      <div className="absolute inset-0 bg-slate-200 rounded-full" />
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`absolute inset-0 origin-left rounded-full transition-colors duration-700 ${stars > 0 ? 'bg-primary' : 'bg-transparent'}`} 
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((level, i) => {
              const unlocked = unlockedLevels.includes(level);
              const stars = starRatings[level] || 0;
              return (
                <motion.button
                  key={level}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  whileHover={unlocked ? { y: -10, transition: { type: "spring", stiffness: 300 } } : {}}
                  disabled={!unlocked}
                  onClick={() => unlocked && onSelectLevel(level)}
                  className={`group relative text-left rounded-[32px] border transition-all duration-500 min-h-[380px] p-8 ${
                    unlocked
                      ? 'bg-white border-slate-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(59,130,246,0.15)] hover:border-primary/20'
                      : 'bg-slate-50/50 border-slate-100/50 cursor-not-allowed'
                  }`}
                >
                  {/* Status Overlay */}
                  {!unlocked && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[32px] bg-slate-50/40 backdrop-blur-[1px]">
                      <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-4 border border-slate-100">
                        <MdLockOutline size={24} className="text-slate-300" />
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Locked</span>
                    </div>
                  )}

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-8">
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl shadow-sm border border-slate-50 ${unlocked ? 'bg-slate-50 text-primary' : 'bg-white/50 text-slate-300'}`}>
                        {LEVEL_ICONS[i]}
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        unlocked ? `${DIFFICULTY_BGS[i]} ${DIFFICULTY_COLORS[i]}` : 'bg-slate-100 text-slate-400'
                      }`}>
                        {LEVEL_DIFFICULTY[i]} PRO
                      </div>
                    </div>

                    <div className="mb-auto">
                      <span className="text-[10px] font-mono text-primary font-black tracking-[0.4em] uppercase mb-2 block">Phase 0{level}</span>
                      <h3 className="text-2xl font-heading font-black text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {LEVEL_TITLES[level]}
                      </h3>
                      <p className="mt-4 text-[13px] font-mono leading-relaxed text-slate-500 opacity-80 line-clamp-3">
                         {LEVEL_FORMATS[level]}
                      </p>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map(s => (
                          <MdStar
                            key={s}
                            size={20}
                            className={s <= stars ? 'text-amber-400' : 'text-slate-200'}
                          />
                        ))}
                      </div>
                      {unlocked && (
                        <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                          <MdChevronRight size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
