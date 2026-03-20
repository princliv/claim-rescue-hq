import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, HelpCircle, ShieldCheck } from 'lucide-react';

interface Props {
  visible: boolean;
  onEnterGame: () => void;
  onHowToPlay: () => void;
  onClose: () => void;
}

export default function StartSimulationModal({ visible, onEnterGame, onHowToPlay, onClose }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a0f18]/60 backdrop-blur-xl cursor-pointer"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="bg-white/95 backdrop-blur-3xl border border-white/40 rounded-[42px] shadow-[0_50px_100px_rgba(0,0,0,0.3)] max-w-md w-full overflow-hidden relative cursor-default"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-primary to-blue-400" />

            <div className="p-10 flex flex-col items-center text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}
                className="w-20 h-20 rounded-3xl bg-blue-50 text-primary flex items-center justify-center mb-8 shadow-inner ring-1 ring-blue-100/50"
              >
                <ShieldCheck size={40} className="text-primary" />
              </motion.div>

              <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tighter leading-none mb-3">
                Ready to Begin?
              </h2>
              <p className="text-[13px] font-mono font-medium text-slate-500 leading-relaxed mb-10 max-w-[280px]">
                Initialize your clinical training cycle or review the operational manual.
              </p>

              <div className="w-full space-y-4">
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onEnterGame}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-heading font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all"
                >
                  <Play size={18} fill="currentColor" />
                  Enter into game
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: 'rgba(37,99,235,0.05)', scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onHowToPlay}
                  className="w-full py-5 bg-transparent text-primary/60 border-2 border-primary/10 rounded-2xl font-heading font-black text-sm uppercase tracking-widest hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-3"
                >
                  <HelpCircle size={18} />
                  How to play
                </motion.button>
              </div>

              <p className="mt-8 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest opacity-60">
                System Status: Calibrated & Ready
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
