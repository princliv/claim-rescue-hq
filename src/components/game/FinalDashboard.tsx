import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelResult, LEVEL_TITLES } from '@/types/game';
import section1Bg from '@/assets/bg_section1.png';

// React Icons Imports
import { 
  MdRefresh, 
  MdShare, 
  MdCheckCircle, 
  MdMilitaryTech, 
  MdWorkspacePremium, 
  MdOutlineAnalytics, 
  MdEmojiEvents, 
  MdStars, 
  MdHistoryEdu, 
  MdOutlineVerified 
} from 'react-icons/md';
import { 
  BsShieldFillCheck, 
  BsLightningFill, 
  BsAwardFill, 
  BsGraphUpArrow 
} from 'react-icons/bs';

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
    const duration = 2500;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // Quartic ease out
      setDisplayScore(Math.floor(eased * totalScore));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [totalScore]);

  const badge = totalScore >= 500
    ? { label: 'CERTIFIED SENIOR ANALYST', color: 'text-emerald-600', icon: <MdWorkspacePremium size={64} className="text-emerald-500" />, bg: 'bg-emerald-50', border: 'border-emerald-200' }
    : totalScore >= 300
      ? { label: 'CERTIFIED ASSOCIATE', color: 'text-blue-600', icon: <MdMilitaryTech size={64} className="text-blue-500" />, bg: 'bg-blue-50', border: 'border-blue-200' }
      : { label: 'JUNIOR ANALYST', color: 'text-amber-600', icon: <MdOutlineAnalytics size={64} className="text-amber-500" />, bg: 'bg-amber-50', border: 'border-amber-200' };

  const shareScore = () => {
    navigator.clipboard.writeText(`Claim Rescue HQ Certified — Score: ${totalScore}/600 — ${badge.label}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafbfc] relative overflow-hidden font-sans">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20 scale-110 blur-[4px]"
        style={{ backgroundImage: `url(${section1Bg})` }}
      />
      <div className="absolute inset-0 bg-white z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 25 }}
        className="bg-white border border-slate-100 rounded-[64px] p-8 md:p-12 max-w-6xl w-full shadow-[0_60px_120px_rgba(0,0,0,0.1)] relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6 border-b lg:border-b-0 lg:border-r border-slate-100 lg:pr-12">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
              className={`w-32 h-32 rounded-[48px] flex items-center justify-center mb-10 shadow-2xl ${badge.bg} ${badge.border} border-2 relative`}
            >
              {badge.icon}
              <div className="absolute -bottom-3 -right-3 bg-primary text-white p-3 rounded-2xl shadow-xl">
                 <MdStars size={24} />
              </div>
            </motion.div>

            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-black mb-6 tracking-[0.4em] uppercase shadow-lg">
              <MdEmojiEvents size={16} className="text-amber-400" /> MISSION_COMMAND_SUCCESS
            </div>

            <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-none mb-4">Course Graduation</h1>
            <p className={`text-[11px] font-mono font-black tracking-[0.5em] ${badge.color} mb-10 uppercase`}>{badge.label}</p>

            <div className="flex flex-col items-center gap-4 w-full px-12">
               <div className="flex items-end gap-3">
                   <motion.span className="font-mono text-8xl font-black text-primary tracking-tighter tabular-nums">
                     {displayScore}
                   </motion.span>
                   <span className="text-slate-300 text-3xl font-mono font-bold mb-3 uppercase tracking-widest">PTS</span>
               </div>
               
               <div className="w-full h-5 bg-slate-100 rounded-full p-1.5 border border-slate-200/50 shadow-inner overflow-hidden">
                 <motion.div
                   initial={{ width: 0 }}
                   animate={{ width: `${(totalScore / 600) * 100}%` }}
                   transition={{ delay: 0.8, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                   className="h-full bg-primary rounded-full relative"
                 />
               </div>
               <p className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-widest mt-1">Global Proficiency Threshold: 600.00</p>
            </div>
          </div>

          <div className="flex-[1.2] flex flex-col justify-between py-2">
            <div className="bg-slate-50 rounded-[40px] border border-slate-100 overflow-hidden mb-8 shadow-sm">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left py-4 px-8 font-black tracking-widest uppercase text-[9px] opacity-60">Investigation Phase</th>
                    <th className="text-center py-4 px-4 font-black tracking-widest uppercase text-[9px] opacity-60">Score_Pts</th>
                    <th className="text-center py-4 px-8 font-black tracking-widest uppercase text-[9px] opacity-60">Recognition</th>
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
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="border-b border-slate-100 last:border-0 hover:bg-white transition-all group"
                      >
                        <td className="py-4 px-8">
                           <div className="flex items-center gap-4">
                              <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">{lvl}</span>
                              <div className="flex flex-col">
                                 <span className="text-slate-800 font-black uppercase tracking-tight text-sm leading-tight">{LEVEL_TITLES[lvl]}</span>
                                 <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest italic">{r ? 'AUDIT_VERIFIED' : 'PENDING_ENTRY'}</span>
                              </div>
                           </div>
                        </td>
                        <td className="py-4 px-4 text-center font-black text-primary text-base">
                           {r ? r.score : '---'}
                        </td>
                        <td className="py-4 px-8 text-center">
                          <div className="flex gap-1 justify-center">
                            {[1, 2, 3].map(s => (
                              <BsAwardFill key={s} size={16} className={s <= stars ? 'text-amber-400' : 'text-slate-200'} />
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10 px-4">
               {[
                 { icon: <MdHistoryEdu />, label: 'SEQUENCE', value: '05_PHASES', color: 'text-slate-400' },
                 { icon: <MdOutlineVerified />, label: 'STATUS', value: 'CERTIFIED', color: 'text-emerald-500' },
                 { icon: <BsGraphUpArrow />, label: 'ACCURACY', value: 'OPTIMAL', color: 'text-primary' },
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`${stat.color} mb-1`}>{React.cloneElement(stat.icon as React.ReactElement, { size: 24 })}</div>
                    <span className="text-[10px] font-mono font-black text-slate-800 uppercase tracking-tighter leading-none">{stat.value}</span>
                    <span className="text-[8px] font-mono font-bold text-slate-300 uppercase tracking-widest">{stat.label}</span>
                 </div>
               ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 px-2">
              <motion.button
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={shareScore}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white text-slate-600 rounded-[32px] font-mono text-xs font-black border-2 border-slate-100 hover:bg-slate-50 transition-all uppercase tracking-[0.2em]"
              >
                <MdShare size={20} /> Dispatch Data
              </motion.button>
              
              <motion.button
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPlayAgain}
                className="flex-[1.2] flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-[32px] font-mono text-xs font-black shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all uppercase tracking-[0.2em]"
              >
                <MdRefresh size={22} /> System Re-initialization
              </motion.button>
            </div>
          </div>
        </div>

        {/* Regulatory Stamp */}
        <div className="absolute bottom-4 right-8 text-black font-mono font-black text-[10px] select-none pointer-events-none uppercase tracking-[0.3em] opacity-30">
           CERTIFICATION_SERIAL: ATH-2026-X
        </div>
      </motion.div>
    </div>
  );
}
