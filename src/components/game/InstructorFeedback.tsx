import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import instructorAvatar from '@/assets/avatar.png';

interface Props {
  visible: boolean;
  isCorrect: boolean;
  explanation: string;
}

export default function InstructorFeedback({ visible, isCorrect, explanation }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: 50 }}
           transition={{ type: 'spring', stiffness: 200, damping: 25 }}
           className="fixed top-28 right-8 z-[100] flex flex-col items-center gap-y-4 max-w-[320px] pointer-events-none"
        >
          {/* ── Just the Avatar Image As-Is (No Modal/Border) ── */}
          <div className="relative pointer-events-auto">
            <motion.div
               className="w-44 h-44 drop-shadow-2xl relative"
            >
               <img 
                 src={instructorAvatar} 
                 alt="Dr. Claims" 
                 className="w-full h-full object-contain contrast-125 grayscale-0 rounded-3xl"
               />
               
               {/* Fixed Status Indicator */}
               <div className={`absolute top-4 right-4 p-1 rounded-full border-2 border-white shadow-lg ${
                 isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
               }`}>
                  {isCorrect ? <MdCheckCircle size={18} className="text-white" /> : <MdCancel size={18} className="text-white" />}
               </div>
            </motion.div>
          </div>

          {/* ── Text-Only Feedback (No Modal Container) ── */}
          <div className="relative pointer-events-auto text-center mt-2 w-full px-6">
            <motion.p
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.15 }}
               className={`text-sm font-mono font-black tracking-tight leading-relaxed drop-shadow-md py-4 px-2 rounded-2xl bg-white/95 border-2 ${
                 isCorrect ? 'text-emerald-600 border-emerald-500' : 'text-rose-600 border-rose-500'
               }`}
            >
               {explanation}
            </motion.p>
            
            <div className="mt-2 flex items-center justify-center gap-2 bg-slate-100 rounded-full px-4 py-1.5 opacity-80 border border-slate-200">
              <span className="text-[10px] font-mono font-black text-slate-800 uppercase tracking-widest whitespace-nowrap">
                DR. CLAIMS | RCM_SPECIALIST
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
