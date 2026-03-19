import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlineLightbulb, MdClose, MdInfoOutline } from 'react-icons/md';

interface Props {
  hints: string[];
  maxHints?: number;
  onHintUsed: (hintUsedCount: number) => void;
}

export default function MentorHint({ hints, maxHints = 2, onHintUsed }: Props) {
  const [usedCount, setUsedCount] = useState(0);
  const [showHint, setShowHint] = useState<string | null>(null);

  const handleRequestHint = () => {
    if (usedCount < maxHints) {
      const hint = hints[usedCount];
      setShowHint(hint);
      const newCount = usedCount + 1;
      setUsedCount(newCount);
      onHintUsed(newCount);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleRequestHint}
        disabled={usedCount >= maxHints}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest transition-all ${
          usedCount >= maxHints 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-amber-100 text-amber-600 hover:bg-amber-200 border border-amber-200 shadow-lg shadow-amber-500/10'
        }`}
      >
        <MdOutlineLightbulb size={16} />
        {usedCount >= maxHints ? 'No Hints Remaining' : `Mentor Hint (${usedCount}/${maxHints})`}
      </motion.button>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full right-0 mb-4 w-64 bg-slate-900 text-white rounded-[24px] p-6 shadow-2xl z-50 border border-white/10"
          >
            <div className="flex items-center justify-between mb-3 text-amber-400">
               <div className="flex items-center gap-2">
                 <MdInfoOutline size={14} />
                 <span className="text-[9px] font-mono font-black uppercase tracking-widest">Protocol Tip</span>
               </div>
               <button onClick={() => setShowHint(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                 <MdClose size={14} />
               </button>
            </div>
            <p className="text-[11px] font-mono leading-relaxed opacity-90">{showHint}</p>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
               <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Penalty Applied</span>
               <span className="text-[10px] font-mono font-black text-rose-400">-10 PTS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
