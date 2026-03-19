import React from 'react';
import { motion } from 'framer-motion';
import { BsCheckCircleFill, BsXCircleFill, BsShieldLockFill } from 'react-icons/bs';

interface Props {
  onDecision: (apply: boolean) => void;
  options: string[];
  disabled: boolean;
  question: string;
}

export default function DecisionSection({ onDecision, options, disabled, question }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="relative"
    >
      <div className={`bg-slate-900 rounded-[40px] p-12 text-center text-white relative overflow-hidden transition-all duration-500 ${disabled ? 'opacity-50 grayscale' : 'opacity-100 shadow-[0_0_50px_rgba(37,99,235,0.2)]'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-bl-full blur-3xl" />
        
        {disabled && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
             <div className="p-4 bg-slate-800 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center gap-2">
                <BsShieldLockFill size={32} className="text-amber-500 animate-pulse" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-slate-400">Investigation Incomplete</span>
             </div>
          </div>
        )}

        <h2 className="text-4xl font-heading font-black tracking-tight mb-4 relative z-10 uppercase">Final Settlement Ruling</h2>
        <p className="text-slate-400 font-mono text-sm mb-10 relative z-10 max-w-2xl mx-auto">{question}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 max-w-3xl mx-auto">
          <motion.button
            whileHover={!disabled ? { scale: 1.05, y: -5 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            disabled={disabled}
            onClick={() => onDecision(true)}
            className={`group relative p-8 rounded-[32px] font-black uppercase tracking-widest text-sm transition-all duration-300 ${
              disabled 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5' 
                : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <BsCheckCircleFill size={28} className={disabled ? 'text-slate-700' : 'text-white'} />
              <span>{options[0]}</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={!disabled ? { scale: 1.05, y: -5 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            disabled={disabled}
            onClick={() => onDecision(false)}
            className={`group relative p-8 rounded-[32px] font-black uppercase tracking-widest text-sm transition-all duration-300 ${
              disabled 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5' 
                : 'bg-slate-800 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-700'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <BsXCircleFill size={28} className={disabled ? 'text-slate-700' : 'text-white'} />
              <span>{options[1]}</span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
