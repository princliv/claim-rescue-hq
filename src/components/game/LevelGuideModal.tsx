import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Activity, Target, Zap, ChevronRight, MousePointer2, Hand, TerminalSquare, Eye, Layers } from 'lucide-react';

interface Props {
  visible: boolean;
  onClose: () => void;
  level: number;
  title: string;
  instructions: string[];
  interactionModel?: string;
}

const InteractionVisualAid = ({ model, level }: { model?: string; level: number }) => {
  const containerVariants = {
    animate: { transition: { staggerChildren: 0.8, repeat: Infinity } }
  };

  const itemVariants = {
    initial: { opacity: 0.3, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  switch (model) {
    case 'DETECTIVE_INVESTIGATION':
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="space-y-2 w-full max-w-[160px]">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i} 
              variants={{
                initial: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' },
                animate: i === 2 ? { 
                  backgroundColor: ['rgba(255,255,255,0.05)', 'rgba(59,130,246,0.2)', 'rgba(59,130,246,0.2)'],
                  borderColor: ['rgba(255,255,255,0.1)', 'rgba(59,130,246,0.5)', 'rgba(59,130,246,0.5)'],
                  transition: { duration: 2, repeat: Infinity, times: [0, 0.4, 1] }
                } : {}
              }}
              className="p-2 rounded-lg border flex items-center gap-2 relative overflow-hidden"
            >
              <div className={`w-3 h-3 rounded-full border ${i === 2 ? 'border-blue-400' : 'border-white/20'}`}>
                 {i === 2 && <motion.div animate={{ scale: [0, 1] }} transition={{ repeat: Infinity, duration: 2, times: [0.4, 0.5] }} className="w-full h-full bg-blue-500 rounded-full" />}
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full" />
              {i === 2 && (
                <motion.div 
                  animate={{ x: [20, 0, 0], y: [20, 0, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, times: [0, 0.4, 0.9] }}
                  className="absolute right-2 text-blue-400"
                >
                  <MousePointer2 size={12} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      );
    case 'DRAG_AND_DROP':
      return (
        <div className="flex flex-col gap-6 w-full items-center py-4">
          <motion.div 
            animate={{ 
              x: [0, 0, 0, 0], 
              y: [0, 40, 40, 0],
              scale: [1, 1, 0.8, 1],
              opacity: [1, 1, 0, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.6, 1] }}
            className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 relative z-10"
          >
            <Layers size={18} />
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, times: [0.3, 0.4, 0.5] }}
              className="absolute -bottom-2 -right-2 text-blue-300"
            >
              <Hand size={14} />
            </motion.div>
          </motion.div>
          
          <div className="w-24 h-12 rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center">
             <motion.div 
               animate={{ opacity: [0, 0, 1, 0], scale: [0.8, 0.8, 1, 0.8] }}
               transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 0.6, 0.9] }}
               className="w-8 h-4 bg-blue-500/40 rounded-sm"
             />
          </div>
        </div>
      );
    case 'TERMINAL_TABS':
      return (
        <div className="w-full max-w-[200px] space-y-1">
          <div className="flex gap-1 px-1">
             {[1, 2, 3].map(i => (
               <motion.div 
                 key={i} 
                 animate={i === ((((level % 3) || 1)) + 1) % 3 + 1 ? { // Simple cycle simulation
                    backgroundColor: ['rgba(255,255,255,0.05)', 'rgba(59,130,246,0.3)', 'rgba(255,255,255,0.05)'],
                    transition: { duration: 3, repeat: Infinity, delay: i * 0.5 }
                 } : {}}
                 className="h-4 w-10 rounded-t-md border-x border-t border-white/10 bg-white/5" 
               />
             ))}
          </div>
          <div className="h-20 w-full rounded-xl border border-white/10 bg-slate-950 p-3 relative overflow-hidden">
            <motion.div 
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="space-y-2"
            >
              <div className="h-1.5 w-3/4 bg-white/10 rounded-full" />
              <div className="h-1.5 w-full bg-white/10 rounded-full" />
              <div className="h-1.5 w-1/2 bg-blue-500/40 rounded-full" />
            </motion.div>
            <motion.div 
               animate={{ x: [100, 10], y: [40, 40], opacity: [0, 1, 0] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute text-blue-400"
            >
               <MousePointer2 size={12} />
            </motion.div>
          </div>
        </div>
      );
    case 'COMPARISON':
      return (
        <div className="flex gap-4 w-full max-w-[240px] items-center">
          <div className="flex-1 h-20 rounded-xl border border-white/10 bg-white/5 p-3 space-y-2 relative overflow-hidden">
             <div className="h-1.5 w-full bg-white/10 rounded-full" />
             <div className="h-1.5 w-3/4 bg-blue-500/20 rounded-full" />
             <motion.div 
               animate={{ y: [-10, 60] }}
               transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
               className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
             />
          </div>
          <div className="flex-1 h-20 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 space-y-2 relative overflow-hidden">
             <div className="h-1.5 w-full bg-white/10 rounded-full" />
             <div className="h-1.5 w-3/4 bg-blue-500/40 rounded-full" />
             <motion.div 
               animate={{ opacity: [0, 0, 1, 0] }}
               transition={{ duration: 2, repeat: Infinity, times: [0, 0.8, 0.9, 1] }}
               className="absolute inset-0 flex items-center justify-center text-blue-400"
             >
                <Eye size={24} />
             </motion.div>
          </div>
        </div>
      );
    case 'SPLIT_SCREEN':
      return (
        <div className="flex gap-2 w-full max-w-[220px] h-24">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3 overflow-hidden">
             <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="h-1.5 w-full bg-white/10 rounded-full" 
                  />
                ))}
             </div>
          </div>
          <div className="flex-[0.4] rounded-xl border border-blue-500/30 bg-blue-500/10 flex flex-col items-center justify-center gap-2">
             <motion.div 
               animate={{ rotate: [0, 360] }}
               transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
               className="text-blue-400"
             >
                <Zap size={16} />
             </motion.div>
             <div className="h-1 w-8 bg-blue-500/40 rounded-full" />
          </div>
        </div>
      );
    default:
      return (
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 animate-pulse">
           <Activity size={32} className="text-slate-800 mx-auto" />
        </div>
      );
  }
};

export default function LevelGuideModal({ visible, onClose, level, title, instructions, interactionModel }: Props) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!visible) return;
    
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]); // Only restart when 'visible' changes

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 200 }}
            onClick={e => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl p-0 max-w-2xl w-full overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-blue-400" />
                <h2 className="text-base font-heading font-bold text-slate-800">Investigation Briefing</h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-5">
                   <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <Activity size={20} />
                   </div>
                   <div className="min-w-0">
                      <h3 className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest mb-0.5">Objective</h3>
                      <p className="text-base font-heading font-bold text-slate-800 leading-tight truncate">
                         L{level}: {title}
                      </p>
                   </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-0 relative overflow-hidden group">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                    <Target size={14} className="text-primary" />
                    <h3 className="text-xs font-heading font-bold text-slate-700">Interaction</h3>
                  </div>

                  <div className="flex items-center justify-center p-3 min-h-[110px] bg-slate-100 rounded-xl border border-slate-200 mb-3">
                     <InteractionVisualAid model={interactionModel} level={level} />
                  </div>

                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Type:</span>
                     <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-400 font-black border border-blue-500/20">
                       {interactionModel?.replace(/_/g, ' ') || 'STANDARD'}
                     </span>
                  </div>
                </div>
              </div>

              <div className="flex-[1.1] flex flex-col">
                <div className="flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
                   <Zap size={14} className="text-warning" />
                   <h3 className="text-xs font-heading font-bold text-slate-700">Protocol</h3>
                </div>
                
                <div className="space-y-2 mb-6 pr-1">
                  {instructions.map((text, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-200"
                    >
                      <div className="mt-0.5 w-5 h-5 rounded-md bg-white flex-shrink-0 border border-slate-200 shadow-sm flex items-center justify-center text-[9px] font-bold text-blue-500">
                        {i + 1}
                      </div>
                      <p className="text-[12px] font-mono text-slate-600 leading-snug">
                        {text}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={onClose}
                  className="mt-auto w-full flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-mono font-black uppercase tracking-widest border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all shadow-lg active:scale-95 overflow-hidden relative"
                >
                  <motion.div 
                    key={visible ? 'active' : 'inactive'}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="absolute inset-0 bg-primary/10 origin-left"
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Start Investigation ({countdown}S) <ChevronRight size={16} />
                  </span>
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

