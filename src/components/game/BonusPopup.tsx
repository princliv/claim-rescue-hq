import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdStars, MdCheckCircle, MdCancel, MdHelpOutline } from 'react-icons/md';

import { BONUS_QUESTIONS } from '@/data/questionsData';

interface BonusQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface Props {
  onComplete: (score: number) => void;
}

export default function BonusPopup({ onComplete }: Props) {
  const [question, setQuestion] = useState<BonusQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * BONUS_QUESTIONS.length);
    setQuestion(BONUS_QUESTIONS[randomIdx]);
  }, []);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowFeedback(true);
    
    setTimeout(() => {
      onComplete(idx === question?.correct ? 10 : 0);
    }, 2000);
  };

  if (!question) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-[40px] p-8 max-w-md w-full shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-right from-amber-400 to-primary" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center animate-pulse">
            <MdStars size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Bonus Intel</h4>
            <span className="text-xl font-heading font-black text-slate-900 tracking-tight leading-none uppercase">Rapid Quiz Phase</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100 italic text-slate-700 text-lg font-medium leading-relaxed">
           "{question.question}"
        </div>

        <div className="space-y-3">
          {question.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={selected === null ? { x: 5, backgroundColor: '#f8fafc' } : {}}
              onClick={() => handleSelect(i)}
              className={`w-full p-5 rounded-2xl flex items-center justify-between border transition-all font-bold text-sm uppercase tracking-wide
                ${selected === i 
                  ? (i === question.correct ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-rose-50 border-rose-500 text-rose-700')
                  : (selected !== null && i === question.correct ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-600')
                }
              `}
            >
              {opt}
              {selected === i && (
                i === question.correct ? <MdCheckCircle /> : <MdCancel />
              )}
              {selected !== null && i === question.correct && i !== selected && <MdCheckCircle className="opacity-50" />}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 text-center text-xs font-black uppercase tracking-widest ${selected === question.correct ? 'text-emerald-500' : 'text-rose-500'}`}
            >
              {selected === question.correct ? '+10 BONUS POINTS ACCRUED' : 'BOOST ATTEMPT FAILED'}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2 text-[10px] text-slate-400 font-mono italic">
          <MdHelpOutline />
          <span>Quick response required for certification points.</span>
        </div>
      </motion.div>
    </div>
  );
}
