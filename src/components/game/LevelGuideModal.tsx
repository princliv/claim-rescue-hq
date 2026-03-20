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

/* ── Gesture Animations (Blue Premium) ─────────────────── */

function SelectOneGesture() {
  return (
    <div className="relative w-56 h-32 mx-auto flex flex-col justify-center gap-2 pt-2">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className={`h-8 rounded-xl border-2 text-[10px] font-mono font-black flex items-center px-4 transition-all ${
            i === 2
              ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5'
              : 'border-slate-200/50 bg-white/40 text-slate-300'
          }`}
        >
          {i === 2 ? 'CORRECT_DECISION' : `NEUTRAL_PATH_0${i}`}
          {i === 2 && <MdCheckCircle size={12} className="ml-auto text-primary" />}
        </motion.div>
      ))}
      <motion.div
        className="absolute right-0 text-primary select-none drop-shadow-md"
        initial={{ y: 0, x: 0 }}
        animate={{ y: [0, 10, 10, 0], x: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
        style={{ top: 32, right: 8 }}
      >
        <BsCursorFill size={22} className="fill-primary" />
      </motion.div>
    </div>
  );
}

function DragGesture() {
  return (
    <div className="relative w-56 h-32 mx-auto flex items-center justify-center">
      <div className="flex items-center gap-6">
        <motion.div
          className="w-18 h-14 rounded-2xl border-2 border-primary bg-primary/10 flex flex-col items-center justify-center gap-1 shadow-lg shadow-primary/5"
          animate={{ x: [0, 12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }}
        >
          <MdOutlineFileCopy size={18} className="text-primary" />
          <span className="text-[9px] font-mono font-black text-primary uppercase">Claim</span>
        </motion.div>
        <motion.div className="text-primary/20 font-black text-xs animate-pulse">→</motion.div>
        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300/50 flex items-center justify-center">
          <span className="text-[8px] font-mono font-black text-slate-300 text-center uppercase tracking-tight">Zone<br/>Alpha</span>
        </div>
      </div>
      <motion.div
        className="absolute text-slate-400 select-none drop-shadow-xl"
        style={{ bottom: 4, left: 32 }}
        animate={{ x: [0, 60, 60, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
      >
        <BsHandIndexThumbFill size={32} className="fill-slate-400/30" />
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
    <div className="relative w-56 h-32 mx-auto flex flex-col justify-center">
      <div className="flex gap-1.5 mb-1 h-7">
        {['MHI', 'CAS', 'CGX'].map((tab, i) => (
          <div
            key={tab}
            className={`flex-1 rounded-t-xl border-t-2 border-x-2 text-[9px] font-mono font-black flex items-center justify-center transition-all ${
                i === active ? 'border-primary/40 bg-primary/5 text-primary shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-300'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="h-14 rounded-b-xl rounded-tr-xl border-2 border-slate-100 bg-white flex items-center justify-center shadow-sm">
        <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">LIVE DATA FEED...</span>
      </div>
      <motion.div
        className="absolute text-primary select-none drop-shadow-lg"
        style={{ bottom: 0, left: active * 65 + 16 }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 0.45, repeat: Infinity, repeatDelay: 0.55 }}
      >
        <BsCursorFill size={20} className="fill-primary" />
      </motion.div>
    </div>
  );
}

function CompareGesture() {
  return (
    <div className="relative w-56 h-32 mx-auto flex items-center gap-4">
      <div className="flex-1 h-16 rounded-2xl border-2 border-primary/20 bg-primary/5 p-2 overflow-hidden">
        <div className="text-[8px] font-mono font-black text-primary/40 mb-1 uppercase tracking-tighter">Claim_A</div>
        <motion.div
          className="h-1.5 rounded-full bg-rose-500/40 w-3/4 mb-1.5"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <div className="h-1.5 rounded-full bg-primary/10 w-full" />
      </div>
      <MdVisibility size={20} className="text-primary/20 animate-pulse" />
      <div className="flex-1 h-16 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-2 overflow-hidden">
        <div className="text-[8px] font-mono font-black text-emerald-400 mb-1 uppercase tracking-tighter">Source_B</div>
        <motion.div
          className="h-1.5 rounded-full bg-emerald-500/60 w-1/2 mb-1.5"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
        />
        <div className="h-1.5 rounded-full bg-emerald-500/10 w-full" />
      </div>
    </div>
  );
}

function SplitScreenGesture() {
  return (
    <div className="relative w-56 h-32 mx-auto flex flex-col justify-center gap-2">
      <div className="flex gap-2 h-18">
        <div className="flex-1 rounded-2xl border-2 border-primary/10 bg-primary/5 p-3 space-y-2 overflow-hidden">
           {[1, 2, 3].map(i => (
             <motion.div 
               key={i}
               animate={{ opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
               className="h-1.5 w-full bg-primary/20 rounded-full" 
             />
           ))}
        </div>
        <div className="flex-[0.5] rounded-2xl border-2 border-blue-200 bg-blue-50 flex items-center justify-center shadow-inner">
           <motion.div 
             animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="text-primary/60"
           >
              <MdTimeline size={24} />
           </motion.div>
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest">Multi-Layer Validation Active</span>
        <div className="flex gap-1.5">
           <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
           <div className="w-2 h-2 rounded-full bg-slate-200" />
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
    
    // Always scroll to top when modal becomes visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
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
      case 'DETECTIVE_INVESTIGATION': return 'Pick One';
      case 'DRAG_AND_DROP': return 'Drag & Drop';
      case 'TERMINAL_TABS': return 'Sync Tabs';
      case 'COMPARISON': return 'Compare Data';
      case 'SPLIT_SCREEN': return 'Split Screen';
      default: return 'Directive';
    }
  };

  const getInteractionSubtitle = () => {
    switch (interactionModel) {
      case 'DETECTIVE_INVESTIGATION': return 'SELECT THE OPTIMAL ANALYTIC PATH TO PROCEED';
      case 'DRAG_AND_DROP': return 'MOVE THE DATA CARD TO THE CORRECT STATUS ZONE';
      case 'TERMINAL_TABS': return 'ACCESS AND SYNC ALL SYSTEM FEEDS TO UNLOCK';
      case 'COMPARISON': return 'EXECUTE SIDE-BY-SIDE CROSS-MATCH VALIDATION';
      case 'SPLIT_SCREEN': return 'VALIDATE MULTI-LAYER REGULATORY RULE LOGIC';
      default: return 'FOLLOW THE ESTABLISHED INVESTIGATION PROTOCOL';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f18]/40 backdrop-blur-2xl p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 220, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-3xl border-2 border-white/20 rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.2)] max-w-md w-full overflow-hidden relative"
          >
            {/* Top Indicator */}
            <div className="h-2 bg-primary w-full shadow-[0_4px_10px_rgba(37,99,235,0.3)]" />

            <div className="p-6 flex flex-col items-center">
              
              {/* Animation Container (Image 5 style) */}
              <div className="w-full max-w-[320px] h-32 bg-slate-50 border-2 border-slate-100 rounded-[40px] flex items-center justify-center relative overflow-hidden shadow-inner mb-4">
                 <div className="">
                    <InteractionVisualAid model={interactionModel} />
                 </div>
                 
                 {/* Decorative elements */}
                 <div className="absolute top-4 left-4 flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                 </div>
                 <div className="absolute bottom-4 right-4 flex gap-1">
                    <div className="w-8 h-1 bg-primary/10 rounded-full" />
                 </div>
              </div>

              {/* Analytical Directive Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-black tracking-widest uppercase mb-2 shadow-sm border border-primary/5">
                 Analytical Directive
              </div>

              {/* Title & Subtitle */}
              <div className="text-center mb-4">
                 <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tighter mb-1">{getInteractionTitle()}</h2>
                 <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.05em] px-4 leading-relaxed">
                    {getInteractionSubtitle()}
                 </p>
              </div>

              {/* Action Button */}
              <div className="w-full relative group">
                <motion.button
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onClose}
                  className="w-full py-4 bg-primary text-white rounded-[28px] font-mono font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(37,99,235,0.15)] hover:bg-blue-600 transition-all z-10 relative overflow-hidden"
                >
                  <span className="relative z-10">Start Assessment</span>
                  
                  {/* Countdown Progress */}
                  <div className="absolute inset-0 bg-white/10 pointer-events-none">
                     <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                        className="h-full bg-white/20 origin-left"
                     />
                  </div>
                </motion.button>
                
                <p className="text-center text-[10px] font-mono font-black text-slate-300 mt-2 uppercase tracking-[0.2em]">
                   Link active in {countdown}s
                </p>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

