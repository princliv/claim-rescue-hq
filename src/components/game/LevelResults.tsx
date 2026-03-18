import React from 'react';
import { motion } from 'framer-motion';
import { LevelResult, LEVEL_TITLES } from '@/types/game';
import section1Bg from '@/assets/bg_section1.png';

// React Icons Imports
import { 
  MdRefresh, 
  MdNavigateNext, 
  MdCheckCircle, 
  MdCancel, 
  MdTimer, 
  MdOutlineAnalytics, 
  MdAssignmentTurnedIn, 
  MdMilitaryTech 
} from 'react-icons/md';
import { 
  BsLightningFill, 
  BsFillStarFill, 
  BsJournalCheck, 
  BsGraphUpArrow 
} from 'react-icons/bs';

interface Props {
  result: LevelResult;
  onNext: () => void;
  onRetry: () => void;
  isLastLevel: boolean;
}

export default function LevelResults({ result, onNext, onRetry, isLastLevel }: Props) {
  const accuracy = result.totalQuestions > 0
    ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
    : 0;

  const badge = accuracy >= 90
    ? { label: 'SENIOR ANALYST', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <MdMilitaryTech size={56} className="text-emerald-500" />, border: 'border-emerald-200' }
    : accuracy >= 60
      ? { label: 'ASSOCIATE ANALYST', color: 'text-blue-600', bg: 'bg-blue-50', icon: <MdAssignmentTurnedIn size={56} className="text-blue-500" />, border: 'border-blue-200' }
      : { label: 'JUNIOR ANALYST', color: 'text-amber-600', bg: 'bg-amber-50', icon: <MdOutlineAnalytics size={56} className="text-amber-500" />, border: 'border-amber-200' };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafbfc] relative overflow-hidden font-sans">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20 scale-110 blur-[4px]"
        style={{ backgroundImage: `url(${section1Bg})` }}
      />
      <div className="absolute inset-0 bg-white/70 z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 25 }}
        className="bg-white border border-slate-100 rounded-[64px] p-8 md:p-12 max-w-4xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.1)] relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row gap-12 items-stretch">
          
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6 border-b md:border-b-0 md:border-r border-slate-100 lg:pr-12">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={`w-32 h-32 rounded-[40px] flex items-center justify-center mb-8 shadow-2xl ${badge.bg} ${badge.border} border-2 relative`}
            >
              {badge.icon}
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-2xl shadow-xl">
                 <BsJournalCheck size={20} />
              </div>
            </motion.div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-slate-900 text-white font-mono text-[9px] font-black mb-4 tracking-[0.2em] uppercase">
              Audit Stream Finalized
            </div>
            <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight leading-none mb-3">Case {result.level} Complete</h2>
            <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest mb-6">{LEVEL_TITLES[result.level]}</p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`px-5 py-2.5 rounded-3xl ${badge.bg} ${badge.color} font-mono font-black text-xs tracking-[0.4em] inline-block border ${badge.border} uppercase`}
            >
              {badge.label}
            </motion.div>
          </div>

          <div className="flex-[1.4] flex flex-col justify-between pt-4 md:pt-0">
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
              {[
                { icon: <BsLightningFill size={16} />, label: 'SCORE', value: result.score.toString(), color: 'text-primary', bg: 'bg-primary/5' },
                { icon: <MdTimer size={16} />, label: 'TIME', value: `${result.time}s`, color: 'text-slate-600', bg: 'bg-slate-50' },
                { icon: <BsGraphUpArrow size={16} />, label: 'ACCURACY', value: `${accuracy}%`, color: accuracy >= 60 ? 'text-emerald-600' : 'text-rose-600', bg: accuracy >= 60 ? 'bg-emerald-50' : 'bg-rose-50' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`${stat.bg} border-2 border-white rounded-[32px] p-4 text-center shadow-sm flex flex-col items-center gap-2`}
                >
                  <div className={`${stat.color} p-2 rounded-xl bg-white shadow-sm`}>
                    {stat.icon}
                  </div>
                  <p className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                  <p className={`text-xl font-mono font-black tracking-tighter ${stat.color} leading-none`}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-[40px] p-6 mb-10 border border-slate-100 relative">
               <h3 className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center">Analytic Breakdown</h3>
               <div className="flex flex-wrap items-center justify-center gap-8">
                  <div className="flex items-center gap-3">
                    <MdCheckCircle size={20} className="text-emerald-500" />
                    <div className="flex flex-col">
                       <span className="text-sm font-mono font-black text-slate-800 leading-none">{result.correctAnswers}</span>
                       <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">VERIFIED</span>
                    </div>
                  </div>
                  <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                  <div className="flex items-center gap-3">
                    <MdCancel size={20} className="text-rose-400" />
                    <div className="flex flex-col">
                       <span className="text-sm font-mono font-black text-slate-800 leading-none">{result.totalQuestions - result.correctAnswers}</span>
                       <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">ERRORS</span>
                    </div>
                  </div>
                  <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                  <div className="flex items-center gap-3">
                    <BsFillStarFill size={18} className="text-amber-400" />
                    <div className="flex flex-col">
                       <span className="text-sm font-mono font-black text-slate-800 leading-none">{result.hintsUsed}</span>
                       <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">HINTS</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRetry}
                className="flex-[0.8] flex items-center justify-center gap-3 px-8 py-5 bg-white text-slate-600 rounded-[28px] font-mono text-xs font-black border-2 border-slate-100 hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                <MdRefresh size={20} /> Re-Sync
              </motion.button>
              <motion.button
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNext}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-[28px] font-mono text-xs font-black shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all uppercase tracking-widest"
              >
                {isLastLevel ? 'Review Global Analytics' : 'Begin Next Investigation'} <MdNavigateNext size={24} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Subtle Regulatory Stamp */}
        <div className="absolute bottom-4 right-8 text-black font-mono font-black text-[10px] select-none pointer-events-none uppercase tracking-[0.3em] opacity-30">
           AUDIT_APPROVED // PH-0{result.level}
        </div>
      </motion.div>
    </div>
  );
}
