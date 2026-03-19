import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdCancel, MdArrowForward, MdInfoOutline, MdHistoryEdu } from 'react-icons/md';

interface Props {
  visible: boolean;
  isCorrect: boolean;
  explanation: string;
  ruleInfo: string;
  onContinue: () => void;
}

export default function DetailedFeedbackModal({ visible, isCorrect, explanation, ruleInfo, onContinue }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="bg-white rounded-[48px] p-8 md:p-10 max-w-xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative overflow-hidden"
          >
            <div className={`absolute top-0 inset-x-0 h-3 ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 shadow-xl ${isCorrect ? 'bg-emerald-50 text-emerald-500 shadow-emerald-500/20' : 'bg-rose-50 text-rose-500 shadow-rose-500/20'}`}>
                {isCorrect ? <MdCheckCircle size={36} /> : <MdCancel size={36} />}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full font-mono text-[8px] font-black mb-4 uppercase tracking-widest">
                 Analytical Ruling Finalized
              </div>

              <h2 className={`text-2xl font-heading font-black tracking-tight leading-none mb-3 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isCorrect ? 'Correct Decision' : 'Incorrect Settlement'}
              </h2>

              <p className="text-sm font-heading font-black text-slate-800 tracking-tight leading-relaxed mb-6 max-w-md">
                {explanation}
              </p>

              <div className="w-full bg-slate-50 rounded-[32px] p-6 border border-slate-100 text-left mb-6">
                 <div className="flex items-center gap-2 mb-2">
                    <MdHistoryEdu className="text-primary" size={14} />
                    <h3 className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest leading-none">Official Protocol</h3>
                 </div>
                 <p className="text-xs font-mono leading-relaxed text-slate-600 italic">
                   {ruleInfo}
                 </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContinue}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-white font-mono font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${
                  isCorrect ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-primary shadow-primary/30'
                }`}
              >
                <span>Finalize Case Results</span>
                <MdArrowForward size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
