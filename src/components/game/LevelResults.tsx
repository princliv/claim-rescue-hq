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
  MdMilitaryTech,
  MdFactCheck,
  MdStars
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
  onDashboard: () => void;
  isLastLevel: boolean;
}

export default function LevelResults({ result, onNext, onRetry, onDashboard, isLastLevel }: Props) {
  const accuracy = result.totalQuestions > 0
    ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
    : 0;

  const totalPoints = result.score;
  const maxPossible = (10 * 4) + (10 * result.totalQuestions) + 50 + 20 + 10; // Steps + Quiz + Decision + Max Bonus + Bonus Q
  const performancePct = Math.min(100, Math.round((totalPoints / maxPossible) * 100));

  const rating = performancePct >= 90
    ? { label: 'Expert Analyst', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <MdMilitaryTech size={56} className="text-emerald-400" />, border: 'border-emerald-500/30' }
    : performancePct >= 70
      ? { label: 'Intermediate', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: <MdAssignmentTurnedIn size={56} className="text-blue-400" />, border: 'border-blue-500/30' }
      : { label: 'Beginner', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: <MdOutlineAnalytics size={56} className="text-amber-400" />, border: 'border-amber-500/30' };

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
        className="bg-white border border-slate-100 rounded-[64px] p-8 md:p-12 max-w-5xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.1)] relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6 border-b lg:border-b-0 lg:border-r border-slate-100 lg:pr-12">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={`w-32 h-32 rounded-[40px] flex items-center justify-center mb-8 shadow-2xl ${rating.bg} ${rating.border} border-2 relative`}
            >
              {rating.icon}
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
              className={`px-5 py-2.5 rounded-3xl ${rating.bg} ${rating.color} font-mono font-black text-xs tracking-[0.4em] inline-block border ${rating.border} uppercase`}
            >
              {rating.label}
            </motion.div>
          </div>

          <div className="flex-[2] flex flex-col justify-between pt-4 lg:pt-0">
            
            {/* Breakdown Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {[
                { label: 'STEPS', value: result.stepScore, color: 'text-blue-500', icon: <MdOutlineAnalytics size={14} /> },
                { label: 'QUIZ', value: result.quizScore, color: 'text-emerald-500', icon: <MdFactCheck size={14} /> },
                { label: 'DECISION', value: result.decisionScore, color: result.decisionScore > 0 ? 'text-emerald-600' : 'text-rose-500', icon: <MdCheckCircle size={14} /> },
                { label: 'INTEL', value: result.bonusScore || 0, color: 'text-amber-500', icon: <MdStars size={14} /> },
                { label: 'SPEED', value: result.timeBonus, color: 'text-primary', icon: <BsLightningFill size={14} /> },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-slate-50 rounded-[24px] p-3 border border-slate-100 flex flex-col items-center gap-0.5"
                >
                  <div className={`${stat.color} mb-0.5 opacity-70`}>{stat.icon}</div>
                  <span className="text-[7px] font-mono font-black text-slate-400 uppercase tracking-[0.1em]">{stat.label}</span>
                  <span className={`text-base font-mono font-black ${stat.color}`}>{stat.value >= 0 ? '+' : ''}{stat.value}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-slate-900 text-white rounded-[40px] p-6 mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full blur-3xl" />
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="flex flex-col items-center md:items-start">
                     <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-[0.25em] mb-1">Aggregate_Audit_Score</span>
                     <span className="text-5xl font-mono font-black tracking-tighter text-white">{result.score}</span>
                  </div>
                  <div className="flex gap-8">
                     <div className="flex flex-col items-center">
                        <span className="text-[7px] font-mono font-black text-slate-500 uppercase tracking-widest mb-1">ACCURACY</span>
                        <span className="text-xl font-mono font-black text-emerald-400">{accuracy}%</span>
                     </div>
                     <div className="h-10 w-px bg-white/10" />
                     <div className="flex flex-col items-center">
                        <span className="text-[7px] font-mono font-black text-slate-500 uppercase tracking-widest mb-1">PERFORMANCE</span>
                        <span className="text-xl font-mono font-black text-primary">{performancePct}%</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-5 bg-white text-slate-600 rounded-[28px] font-mono text-xs font-black border-2 border-slate-100 hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                <MdRefresh size={20} /> Re-Sync
              </motion.button>
              
              <motion.button
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDashboard}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-5 bg-slate-100 text-slate-600 rounded-[28px] font-mono text-xs font-black hover:bg-slate-200 transition-all uppercase tracking-widest"
              >
                 Dashboard
              </motion.button>

              <motion.button
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNext}
                className="flex-[1.5] flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-[28px] font-mono text-xs font-black shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all uppercase tracking-widest"
              >
                {isLastLevel ? 'Final Review' : 'Next Case'} <MdNavigateNext size={24} />
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
