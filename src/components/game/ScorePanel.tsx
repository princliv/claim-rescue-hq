import React from 'react';
import { motion } from 'framer-motion';
import { 
  MdTrendingUp, 
  MdOutlineQueryStats, 
  MdFactCheck, 
  MdOutlineTimer, 
  MdCheckCircle,
  MdOfflineBolt
} from 'react-icons/md';

interface Props {
  stepScore: number;
  quizScore: number;
  decisionScore: number;
  timeBonus: number;
  totalScore: number;
}

export default function ScorePanel({ stepScore, quizScore, decisionScore, timeBonus, totalScore }: Props) {
  const stats = [
    { label: 'Step Progress', value: stepScore, max: 40, icon: <MdOutlineQueryStats />, color: '#3b82f6' },
    { label: 'Knowledge Check', value: quizScore, max: 40, icon: <MdFactCheck />, color: '#10b981' },
    { label: 'Final Decision', value: decisionScore, max: 50, icon: <MdCheckCircle />, color: '#f59e0b' },
    { label: 'Efficiency Bonus', value: timeBonus, max: 20, icon: <MdOfflineBolt />, color: '#8b5cf6' },
  ];

  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 relative overflow-hidden group"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-bl-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/5 rounded-tr-full blur-[80px]" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
           <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/10 text-primary flex items-center justify-center shadow-xl shadow-primary/10 border border-white/5">
             <MdTrendingUp size={32} />
           </div>
           <div>
              <h3 className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-[0.5em] leading-none mb-2">Live_Performance_Engine</h3>
              <span className="text-2xl font-heading font-black text-white tracking-tight uppercase leading-none">Audit Analytics</span>
           </div>
        </div>

        <div className="space-y-8">
           {stats.map((stat, i) => (
             <motion.div key={stat.label} variants={item} className="group/row">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/80 group-hover/row:scale-110 transition-transform duration-300" style={{ color: stat.color }}>
                        {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest">{stat.label}</span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Protocol_Verify_0{i+1}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <motion.span 
                        key={stat.value}
                        initial={{ scale: 1.5, filter: 'blur(10px)' }}
                        animate={{ scale: 1, filter: 'blur(0px)' }}
                        className="text-sm font-mono font-black text-white"
                      >
                        {stat.value >= 0 ? '+' : ''}{stat.value}
                      </motion.span>
                   </div>
                </div>
                {/* Micro Progress Bar */}
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${Math.min(100, (stat.value / stat.max) * 100)}%` }}
                     transition={{ delay: 0.5 + i * 0.1, duration: 1.5, ease: "circOut" }}
                     className="h-full rounded-full"
                     style={{ background: `linear-gradient(to right, ${stat.color}88, ${stat.color})`, boxShadow: `0 0 10px ${stat.color}44` }}
                   />
                </div>
             </motion.div>
           ))}
        </div>

        <div className="mt-12 pt-10 border-t border-white/10 flex items-center justify-between bg-gradient-to-b from-white/[0.02] to-transparent -mx-10 px-10 rounded-b-[48px]">
           <div className="flex flex-col">
              <span className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-[0.5em] mb-2 leading-none">Net_Simulation_Score</span>
              <motion.span 
                key={totalScore}
                initial={{ scale: 1.2, textShadow: '0 0 30px rgba(59,130,246,0.8)' }}
                animate={{ scale: 1, textShadow: '0 0 50px rgba(59,130,246,0.3)' }}
                className="text-7xl font-mono font-black text-white tracking-tighter leading-none"
              >
                {totalScore}
              </motion.span>
           </div>
           
           <div className="relative group/xp">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover/xp:bg-emerald-500/40 transition-all duration-500" />
              <div className="w-20 h-20 rounded-full border-[6px] border-emerald-500/20 bg-slate-900 flex flex-col items-center justify-center relative z-10 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent" />
                <span className="text-xl font-mono font-black text-emerald-400 leading-none">XP</span>
                <span className="text-[8px] font-mono font-black text-emerald-600 uppercase tracking-widest mt-1">Earned</span>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
