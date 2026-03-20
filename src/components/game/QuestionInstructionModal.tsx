import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsCursorFill, BsGrid3X3GapFill } from 'react-icons/bs';
import { MdCheckCircle, MdOutlineFileCopy, MdCompare, MdTouchApp } from 'react-icons/md';

export type InstructionType = 'select-one' | 'drag-right' | 'tap-tabs' | 'compare-select';

interface Props {
  visible: boolean;
  type: InstructionType;
  onDismiss: () => void;
  autoDismissMs?: number;
}

/* ── Animation Components ───────────────────────────────── */

function SelectOneAnimation() {
  return (
    <div className="relative w-48 h-32 mx-auto flex flex-col justify-center gap-3">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.1 }}
          className={`h-8 rounded-xl border-2 text-[10px] font-mono font-black flex items-center px-4 transition-all ${
            i === 2
              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(37,99,235,0.15)]'
              : 'border-slate-100 bg-white/40 text-slate-300'
          }`}
        >
          {i === 2 ? 'CORRECT_DECISION' : `ANALYSIS_PATH_0${i}`}
          {i === 2 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="ml-auto"
            >
              <MdCheckCircle size={14} className="text-primary" />
            </motion.div>
          )}
        </motion.div>
      ))}
      <motion.div
        className="absolute right-2 text-primary drop-shadow-lg"
        animate={{ 
          y: [40, 4, 4, 40],
          x: [20, 0, 0, 20],
          scale: [1, 0.9, 0.9, 1]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: 40 }}
      >
        <BsCursorFill size={22} className="fill-primary filter brightness-110" />
      </motion.div>
    </div>
  );
}

function DragDropAnimation() {
  return (
    <div className="relative w-56 h-32 mx-auto flex items-center justify-between px-4">
      <motion.div
        className="w-16 h-16 rounded-2xl border-2 border-primary bg-primary/5 flex flex-col items-center justify-center gap-2 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
        animate={{ 
          x: [0, 100, 100, 0],
          opacity: [1, 1, 0, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MdOutlineFileCopy size={24} className="text-primary" />
        <span className="text-[8px] font-mono font-black text-primary uppercase">Node_Data</span>
      </motion.div>

      <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-20 animate-pulse" />
        <BsGrid3X3GapFill size={20} className="text-slate-300 mb-1" />
        <span className="text-[7px] font-mono font-black text-slate-300 uppercase">Target_Zone</span>
      </div>

      <motion.div
        className="absolute text-slate-400/60"
        animate={{ 
          x: [20, 120, 120, 20],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: 10, left: 10 }}
      >
        <MdTouchApp size={32} />
      </motion.div>
    </div>
  );
}

function TabSyncAnimation() {
  const tabs = ['SYS-A', 'SYS-B', 'SYS-C'];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % tabs.length), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-52 h-32 mx-auto flex flex-col justify-center">
      <div className="flex gap-2 mb-2">
        {tabs.map((tab, i) => (
          <motion.div
            key={tab}
            animate={{ 
              borderColor: i === active ? 'rgba(37,99,235,0.5)' : 'rgba(226,232,240,0.5)',
              backgroundColor: i === active ? 'rgba(37,99,235,0.08)' : 'rgba(248,250,252,0.5)',
              color: i === active ? 'rgba(37,99,235,1)' : 'rgba(148,163,184,1)'
            }}
            className="flex-1 py-2 rounded-xl border-2 text-[9px] font-mono font-black text-center shadow-sm"
          >
            {tab}
          </motion.div>
        ))}
      </div>
      <div className="h-14 rounded-2xl border-2 border-slate-100 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-1 shadow-inner relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-0.5 bg-primary/30"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: '100%' }}
        />
        <span className="text-[8px] font-mono font-bold text-slate-400 italic">SYNCING FEED...</span>
        <span className="text-[10px] font-mono font-black text-primary uppercase tracking-widest">{tabs[active]} LIVE</span>
      </div>
    </div>
  );
}

function CompareAnimation() {
  return (
    <div className="relative w-56 h-32 mx-auto flex items-center justify-around gap-4">
      <div className="w-24 h-20 rounded-xl border-2 border-primary/20 bg-primary/5 p-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/40 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
        <div className="h-2 w-full bg-primary/10 rounded-full mb-2" />
        <div className="h-1.5 w-3/4 bg-primary/5 rounded-full mb-1" />
        <div className="h-1.5 w-1/2 bg-primary/5 rounded-full" />
        <div className="absolute bottom-2 right-2 text-primary/30"><MdCompare size={12} /></div>
      </div>

      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-primary"
      >
        <MdCompare size={24} />
      </motion.div>

      <div className="w-24 h-20 rounded-xl border-2 border-rose-200 bg-rose-50/50 p-3 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-full h-[2px] bg-rose-400/60 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <div className="h-2 w-full bg-rose-200/40 rounded-full mb-2" />
        <div className="h-1.5 w-3/4 bg-rose-100/40 rounded-full mb-1" />
        <div className="h-1.5 w-2/3 bg-rose-500/20 rounded-full" />
      </div>
    </div>
  );
}

const CONFIGS: Record<InstructionType, {
  title: string;
  subtitle: string;
  buttonLabel: string;
  animation: React.ReactNode;
}> = {
  'select-one': {
    title: 'Pick One',
    subtitle: 'SELECT THE OPTIMAL ANALYTIC PATH TO PROCEED',
    buttonLabel: 'START ASSESSMENT',
    animation: <SelectOneAnimation />,
  },
  'drag-right': {
    title: 'Drag & Drop',
    subtitle: 'SORT DATA NODES INTO THE CORRECT ANALYTIC ZONE',
    buttonLabel: 'START CLASSIFICATION',
    animation: <DragDropAnimation />,
  },
  'tap-tabs': {
    title: 'Sync Tabs',
    subtitle: 'REVIEW ALL SYSTEM FEEDS TO UNLOCK PROTOCOL',
    buttonLabel: 'START SYNCHRONIZATION',
    animation: <TabSyncAnimation />,
  },
  'compare-select': {
    title: 'Compare & Pick',
    subtitle: 'IDENTIFY ANOMALIES AND COMMIT FINAL JUDGMENT',
    buttonLabel: 'START VALIDATION',
    animation: <CompareAnimation />,
  },
};

/* ── Main Modal ─────────────────────────────────────────── */
export default function QuestionInstructionModal({ visible, type, onDismiss, autoDismissMs = 6000 }: Props) {
  const config = CONFIGS[type];

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(t);
  }, [visible, autoDismissMs, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a0f18]/40 backdrop-blur-md"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 240, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="relative max-w-lg w-full overflow-hidden glass-card"
            style={{
              borderRadius: 42,
              boxShadow: '0 40px 120px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.25)',
            }}
          >
            {/* Top Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 shadow-[0_4px_15px_rgba(37,99,235,0.3)]" />

            {/* Body */}
            <div className="flex flex-col items-center px-10 py-12 text-center relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

              {/* Animation Container */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="mb-8 w-full flex items-center justify-center p-4 bg-slate-50/30 rounded-[32px] border border-slate-100/50 shadow-inner min-h-[160px]"
              >
                {config.animation}
              </motion.div>

              {/* Directive Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-black tracking-[0.2em] uppercase mb-6"
              >
                Analytical Directive
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-heading font-black text-slate-900 leading-none mb-3"
                style={{ fontSize: '2.5rem', letterSpacing: '-0.02em' }}
              >
                {config.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="font-mono font-bold text-slate-400 uppercase tracking-widest mb-10 max-w-xs mx-auto"
                style={{ fontSize: '0.65rem', lineHeight: '1.5', letterSpacing: '0.12em' }}
              >
                {config.subtitle}
              </motion.p>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative w-full"
              >
                <motion.button
                  whileHover={{ y: -4, scale: 1.02, boxShadow: '0 20px 40px rgba(37,99,235,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDismiss}
                  className="relative w-full py-5 bg-primary text-white rounded-[28px] font-mono font-black text-[11px] uppercase tracking-[0.25em] shadow-2xl shadow-primary/30 transition-all overflow-hidden border-none cursor-pointer"
                >
                  <span className="relative z-10">{config.buttonLabel}</span>
                  
                  {/* Shimmer */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                    animate={{ translateX: ['100%', '-100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  />

                  {/* Timer fill */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 origin-left"
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: autoDismissMs / 1000, ease: 'linear' }}
                  />
                </motion.button>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1 }}
                className="text-[9px] font-mono font-black text-slate-400 mt-6 uppercase tracking-[0.3em]"
              >
                Link active in {autoDismissMs / 1000}s
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
