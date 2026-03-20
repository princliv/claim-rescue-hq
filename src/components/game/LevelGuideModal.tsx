import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Activity, Target, Zap, ChevronRight, Eye } from 'lucide-react';
import { 
  MdCheckCircle, 
  MdVisibility, 
  MdFingerprint, 
  MdOutlineFileCopy, 
  MdCompare,
  MdTimeline
} from 'react-icons/md';
import { 
  BsCursorFill, 
  BsHandIndexThumbFill,
  BsGrid3X3GapFill
} from 'react-icons/bs';

interface Props {
  visible: boolean;
  onClose: () => void;
  level: number;
  title: string;
  instructions: string[];
  interactionModel?: string;
}

/* ── Gesture Animations ─────────────────────────────────── */

function SelectOneGesture() {
  return (
    <div className="relative w-48 h-24 mx-auto flex flex-col justify-center gap-1.5 pt-2">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className={`h-6 rounded-lg border-2 text-[8px] font-mono font-black flex items-center px-3 transition-all ${
            i === 2
              ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5'
              : 'border-slate-200/50 bg-white/40 text-slate-300'
          }`}
        >
          {i === 2 ? 'CORRECT_DECISION' : `NEUTRAL_PATH_0${i}`}
          {i === 2 && <MdCheckCircle size={10} className="ml-auto text-primary" />}
        </motion.div>
      ))}
      <motion.div
        className="absolute right-0 text-primary select-none drop-shadow-md"
        initial={{ y: 0, x: 0 }}
        animate={{ y: [0, 8, 8, 0], x: [0, 4, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
        style={{ top: 24, right: 6 }}
      >
        <BsCursorFill size={18} className="fill-primary" />
      </motion.div>
    </div>
  );
}

function DragGesture() {
  return (
    <div className="relative w-48 h-24 mx-auto flex items-center justify-center">
      <div className="flex items-center gap-4">
        <motion.div
          className="w-14 h-10 rounded-xl border-2 border-primary bg-primary/10 flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-primary/5"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }}
        >
          <MdOutlineFileCopy size={14} className="text-primary" />
          <span className="text-[7px] font-mono font-black text-primary uppercase">Claim</span>
        </motion.div>
        <motion.div className="text-primary/20 font-black text-xs animate-pulse">→</motion.div>
        <div className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-300/50 flex items-center justify-center">
          <span className="text-[6px] font-mono font-black text-slate-300 text-center uppercase tracking-tight">Zone<br/>Alpha</span>
        </div>
      </div>
      <motion.div
        className="absolute text-slate-400/60 select-none drop-shadow-lg"
        style={{ bottom: 2, left: 20 }}
        animate={{ x: [0, 50, 50, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
      >
        <BsHandIndexThumbFill size={26} className="fill-slate-400/40" />
      </motion.div>
    </div>
  );
}

function TabGesture() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % 3), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-48 h-24 mx-auto flex flex-col justify-center">
      <div className="flex gap-1 mb-1 h-5">
        {['MHI', 'CAS', 'CGX'].map((tab, i) => (
          <div
            key={tab}
            className={`flex-1 rounded-t-lg border-t-2 border-x-2 text-[7px] font-mono font-black flex items-center justify-center transition-all ${
                i === active ? 'border-primary/30 bg-primary/5 text-primary' : 'border-slate-100 bg-slate-50 text-slate-300'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="h-10 rounded-b-lg rounded-tr-lg border-2 border-slate-100 bg-white flex items-center justify-center shadow-sm">
        <span className="text-[7px] font-mono font-black text-slate-400 uppercase tracking-widest">LIVE DATA FEED...</span>
      </div>
      <motion.div
        className="absolute text-primary select-none drop-shadow-md"
        style={{ bottom: 0, left: active * 55 + 12 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.45, repeat: Infinity, repeatDelay: 0.55 }}
      >
        <BsCursorFill size={16} className="fill-primary" />
      </motion.div>
    </div>
  );
}

function CompareGesture() {
  return (
    <div className="relative w-48 h-24 mx-auto flex items-center gap-3">
      <div className="flex-1 h-12 rounded-xl border-2 border-primary/20 bg-primary/5 p-1.5 overflow-hidden">
        <div className="text-[6px] font-mono font-black text-primary/40 mb-1 uppercase tracking-tighter">Claim_A</div>
        <motion.div
          className="h-1 rounded-full bg-rose-500/30 w-3/4 mb-1"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <div className="h-1 rounded-full bg-primary/5 w-full" />
      </div>
      <MdVisibility size={16} className="text-primary/20 animate-pulse" />
      <div className="flex-1 h-12 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-1.5 overflow-hidden">
        <div className="text-[6px] font-mono font-black text-emerald-400 mb-1 uppercase tracking-tighter">Source_B</div>
        <motion.div
          className="h-1 rounded-full bg-emerald-500/60 w-1/2 mb-1"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
        />
        <div className="h-1 rounded-full bg-emerald-500/10 w-full" />
      </div>
    </div>
  );
}

function SplitScreenGesture() {
  return (
    <div className="relative w-48 h-24 mx-auto flex flex-col justify-center gap-2">
      <div className="flex gap-2 h-14">
        <div className="flex-1 rounded-xl border-2 border-primary/10 bg-primary/5 p-2 space-y-1.5 overflow-hidden">
           {[1, 2].map(i => (
             <motion.div 
               key={i}
               animate={{ opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
               className="h-1 w-full bg-primary/20 rounded-full" 
             />
           ))}
        </div>
        <div className="flex-[0.5] rounded-xl border-2 border-amber-200 bg-amber-50 flex items-center justify-center">
           <motion.div 
             animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="text-amber-500"
           >
              <MdTimeline size={20} />
           </motion.div>
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="text-[6px] font-mono font-black text-slate-400 uppercase tracking-widest">Multi-Layer Validation</span>
        <div className="flex gap-1">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

const InteractionVisualAid = ({ model }: { model?: string }) => {
  switch (model) {
    case 'DETECTIVE_INVESTIGATION':
      return <SelectOneGesture />;
    case 'DRAG_AND_DROP':
      return <DragGesture />;
    case 'TERMINAL_TABS':
      return <TabGesture />;
    case 'COMPARISON':
      return <CompareGesture />;
    case 'SPLIT_SCREEN':
      return <SplitScreenGesture />;
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
  }, [visible, onClose]); // Added onClose to dependencies

  const getInteractionTitle = () => {
    switch (interactionModel) {
      case 'DETECTIVE_INVESTIGATION': return 'PICK ONE';
      case 'DRAG_AND_DROP': return 'DRAG & DROP';
      case 'TERMINAL_TABS': return 'SYNC TABS';
      case 'COMPARISON': return 'COMPARE';
      case 'SPLIT_SCREEN': return 'SPLIT SCREEN';
      default: return 'DETECTIVE';
    }
  };

  const getInteractionSubtitle = () => {
    switch (interactionModel) {
      case 'DETECTIVE_INVESTIGATION': return 'SELECT THE CORRECT PROTOCOL TO PROCEED';
      case 'DRAG_AND_DROP': return 'MOVE THE DATA CARD TO THE CORRECT ZONE';
      case 'TERMINAL_TABS': return 'SYNC ALL PORTAL TABS TO UNLOCK';
      case 'COMPARISON': return 'COMPARE SIDE-BY-SIDE DATA STREAMS';
      case 'SPLIT_SCREEN': return 'VALDIATE MULTI-LAYER RULE LOGIC';
      default: return 'FOLLOW THE INVESTIGATION DIRECTIVE';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xl p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            onClick={e => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-[64px] p-0 max-w-lg w-full overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] relative"
          >
            {/* Soft Gradient Top Bar */}
            <div className="h-24 bg-gradient-to-b from-emerald-400/10 to-transparent absolute top-0 left-0 right-0 pointer-events-none" />
            
            <div className="p-10 flex flex-col items-center">
              
              {/* Close Button */}
              <button 
                onClick={onClose} 
                className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-all active:scale-90"
              >
                <X size={20} />
              </button>

              {/* Central Iconic Animation Container */}
              <div className="relative mb-8 mt-4">
                 <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-32 h-32 rounded-full bg-emerald-50 border-4 border-white shadow-lg flex items-center justify-center relative z-10"
                 >
                    <div className="scale-125">
                       <InteractionVisualAid model={interactionModel} />
                    </div>
                 </motion.div>
                 
                 {/* Decorative Pulse Rings */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-40 rounded-full border border-emerald-500/10 animate-[ping_3s_linear_infinite]" />
                    <div className="w-48 h-48 rounded-full border border-emerald-500/5 animate-[ping_4s_linear_infinite]" />
                 </div>
              </div>

              {/* Title & Subtitle Section */}
              <div className="text-center mb-8 relative z-20">
                 <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tighter mb-2 uppercase italic">
                    {getInteractionTitle()}
                 </h2>
                 <p className="text-[10px] font-mono font-black text-emerald-600/60 uppercase tracking-[0.2em]">
                    {getInteractionSubtitle()}
                 </p>
              </div>

              {/* Protocol Mini-List (Clean & Subtle) */}
              <div className="w-full max-w-sm space-y-1.5 mb-10">
                 <div className="flex items-center gap-2 mb-2 justify-center opacity-40">
                    <Shield size={10} className="text-emerald-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Security Protocol Alpha</span>
                 </div>
                 {instructions.slice(0, 3).map((text, i) => (
                    <motion.div 
                       key={i}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.4 + i * 0.1 }}
                       className="text-[10px] font-mono font-bold text-slate-400 text-center leading-tight truncate px-4"
                    >
                       • {text}
                    </motion.div>
                 ))}
              </div>

              {/* Main Action Button (Centered, theme colored) */}
              <button
                onClick={onClose}
                className="w-full max-w-xs py-5 rounded-[28px] bg-emerald-500 text-white font-heading font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:bg-emerald-600 hover:-translate-y-1 transition-all active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Countdown Fill Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-700/30">
                   <motion.div 
                     key={visible ? 'active' : 'inactive'}
                     initial={{ width: '0%' }}
                     animate={{ width: '100%' }}
                     transition={{ duration: 5, ease: 'linear' }}
                     className="h-full bg-white/40"
                   />
                </div>

                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Assessment ({countdown}S) <ChevronRight size={18} />
                </span>
              </button>
              
              <p className="mt-4 text-[9px] font-mono font-black text-slate-300 uppercase tracking-widest">
                 System Ready: L{level} Directive Active
              </p>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

