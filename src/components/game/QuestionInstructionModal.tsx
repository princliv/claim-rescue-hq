import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// React Icons Imports
import { 
  MdCheckCircle, 
  MdTouchApp, 
  MdVisibility, 
  MdSearch, 
  MdFingerprint, 
  MdOutlineFileCopy, 
  MdInfoOutline,
  MdCompare 
} from 'react-icons/md';
import { 
  BsGrid3X3GapFill, 
  BsCursorFill, 
  BsHandIndexThumbFill 
} from 'react-icons/bs';

export type InstructionType = 'select-one' | 'drag-right' | 'tap-tabs' | 'compare-select';

interface Props {
  visible: boolean;
  type: InstructionType;
  onDismiss: () => void;
  autoDismissMs?: number;
}

const CONFIGS: Record<InstructionType, {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  steps: string[];
  gesture: React.ReactNode;
}> = {
  'select-one': {
    icon: <MdFingerprint size={48} className="text-primary/40 mx-auto" />,
    title: 'Precision Selection',
    subtitle: 'Evaluate the dossier, then choose the optimal analytic path.',
    steps: ['Scan the medical record above', 'Synthesize all available data nodes', 'Commit your final decision'],
    gesture: <SelectOneGesture />,
  },
  'drag-right': {
    icon: <BsGrid3X3GapFill size={44} className="text-primary/40 mx-auto" />,
    title: 'Evidence Categorization',
    subtitle: 'Group critical data points into their respective analytic zones.',
    steps: ['Extract a card from the data pool', 'Deploy it into the correct status zone', 'Complete all classifications to proceed'],
    gesture: <DragGesture />,
  },
  'tap-tabs': {
    icon: <MdTouchApp size={48} className="text-primary/40 mx-auto" />,
    title: 'Multi-System Synchronization',
    subtitle: 'Access and extract data from all network sub-layers.',
    steps: ['Authenticate into each system tab', 'Visually verify all 4 data streams', 'The analytical mode will unlock upon completion'],
    gesture: <TabGesture />,
  },
  'compare-select': {
    icon: <MdCompare size={48} className="text-primary/40 mx-auto" />,
    title: 'Cross-Match Validation',
    subtitle: 'Execute high-fidelity comparison between separate data sources.',
    steps: ['Examine the host claim (Left)', 'Examine the system authorization (Right)', 'Identify mismatch anomalies for judgment'],
    gesture: <CompareGesture />,
  },
};

/* ── Gesture Animations ─────────────────────────────────── */

function SelectOneGesture() {
  return (
    <div className="relative w-48 h-32 mx-auto flex flex-col justify-center gap-2">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className={`h-7 rounded-xl border-2 text-[9px] font-mono font-black flex items-center px-4 transition-all ${
            i === 2
              ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
              : 'border-slate-200/50 bg-white/40 text-slate-300'
          }`}
        >
          {i === 2 ? 'CORRECT_DECISION_01' : `NEUTRAL_PATH_0${i}`}
          {i === 2 && <MdCheckCircle size={12} className="ml-auto text-primary" />}
        </motion.div>
      ))}
      <motion.div
        className="absolute right-0 text-primary select-none drop-shadow-lg"
        initial={{ y: 0, x: 0 }}
        animate={{ y: [0, 9, 9, 0], x: [0, 4, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
        style={{ top: 40, right: 8 }}
      >
        <BsCursorFill size={20} className="fill-primary" />
      </motion.div>
    </div>
  );
}

function DragGesture() {
  return (
    <div className="relative w-48 h-28 mx-auto flex items-center justify-center">
      <div className="flex items-center gap-4">
        <motion.div
          className="w-16 h-12 rounded-2xl border-2 border-primary bg-primary/10 flex flex-col items-center justify-center gap-1 shadow-lg shadow-primary/10"
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }}
        >
          <MdOutlineFileCopy size={16} className="text-primary" />
          <span className="text-[8px] font-mono font-black text-primary uppercase">Data</span>
        </motion.div>
        <motion.div className="text-primary/40 font-black text-xs animate-pulse">→</motion.div>
        <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-300/50 flex items-center justify-center">
          <span className="text-[7px] font-mono font-black text-slate-300 text-center uppercase tracking-tight">Zone<br/>Alpha</span>
        </div>
      </div>
      <motion.div
        className="absolute text-slate-400 select-none drop-shadow-xl"
        style={{ bottom: 4, left: 24 }}
        animate={{ x: [0, 50, 50, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
      >
        <BsHandIndexThumbFill size={28} className="fill-slate-400/80" />
      </motion.div>
    </div>
  );
}

function TabGesture() {
  const tabs = ['MHI', 'CAS', 'CGX'];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % tabs.length), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-52 h-28 mx-auto flex flex-col justify-center">
      <div className="flex gap-1.5 mb-1 h-6">
        {tabs.map((tab, i) => (
          <motion.div
            key={tab}
            animate={{ borderColor: i === active ? 'rgba(37,99,235,0.4)' : 'rgba(148,163,184,0.1)' }}
            className={`flex-1 rounded-t-xl border-t-2 border-x-2 text-[8px] font-mono font-black flex items-center justify-center transition-all ${
                i === active ? 'bg-primary/5 text-primary' : 'bg-slate-50 text-slate-300'
            }`}
          >
            {tab}
          </motion.div>
        ))}
      </div>
      <div className="h-10 rounded-b-xl rounded-tr-xl border-2 border-slate-100 bg-white flex items-center justify-center shadow-sm">
        <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest">{tabs[active]} LIVE FEED...</span>
      </div>
      <motion.div
        className="absolute text-primary select-none drop-shadow-lg"
        style={{ bottom: 0, left: active * 55 + 16 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 0.45, repeat: Infinity, repeatDelay: 0.45 }}
      >
        <BsCursorFill size={18} className="fill-primary" />
      </motion.div>
    </div>
  );
}

function CompareGesture() {
  return (
    <div className="relative w-52 h-28 mx-auto flex items-center gap-4">
      <div className="flex-1 h-14 rounded-2xl border-2 border-primary/20 bg-primary/5 p-2 overflow-hidden">
        <div className="text-[7px] font-mono font-black text-primary/40 mb-1 uppercase tracking-tighter">Target_Claim</div>
        <div className="h-1 rounded-full bg-primary/10 w-full mb-1" />
        <motion.div
          className="h-1.5 rounded-full bg-rose-500/50 w-3/4 mb-1"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </div>
      <motion.div
        className="text-primary/20"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MdVisibility size={20} />
      </motion.div>
      <div className="flex-1 h-14 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-2 overflow-hidden">
        <div className="text-[7px] font-mono font-black text-emerald-400 mb-1 uppercase tracking-tighter">Auth_Source</div>
        <div className="h-1 rounded-full bg-emerald-500/10 w-full mb-1" />
        <motion.div
          className="h-1.5 rounded-full bg-emerald-500 w-1/2 mb-1"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f18]/40 backdrop-blur-md p-6"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 220, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-3xl border-2 border-white/20 rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.2)] max-w-2xl w-full overflow-hidden relative"
          >
            {/* Top Indicator */}
            <div className="h-2 bg-primary w-full shadow-[0_4px_10px_rgba(37,99,235,0.3)]" />

            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10">
              {/* Left Side: Header and Gesture (Standing Out) */}
              <div className="flex-1 flex flex-col">
                <div className="text-center md:text-left mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}
                    className="mb-4 md:mx-0 mx-auto w-fit"
                  >
                    {config.icon}
                  </motion.div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-[9px] font-black tracking-widest uppercase mb-3">
                    <MdInfoOutline size={12} /> Analytical Directive
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-black text-slate-900 tracking-tight leading-none mb-2">{config.title}</h2>
                  <p className="text-[11px] font-mono font-bold text-slate-400 italic tracking-tight">{config.subtitle}</p>
                </div>

                <div className="bg-slate-50/50 rounded-[32px] p-6 border-2 border-slate-100/50 shadow-inner flex-1 flex items-center justify-center">
                  {config.gesture}
                </div>
              </div>

              {/* Right Side: Steps and Actions (Compact) */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-4 mb-8">
                  <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Engagement Protocol:</h3>
                  {config.steps.map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-4 text-[11px] font-mono text-slate-600 font-bold leading-tight bg-white/50 p-3 rounded-2xl border border-white"
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black flex items-center justify-center flex-shrink-0 text-[10px] shadow-lg shadow-slate-900/10">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="relative group">
                  <motion.button
                    whileHover={{ y: -5, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={onDismiss}
                    className="w-full py-5 bg-primary text-white rounded-[24px] font-mono font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all z-10 relative"
                  >
                    Acknowledge & Sync
                  </motion.button>
                  <div className="absolute inset-0 rounded-[24px] pointer-events-none overflow-hidden">
                    <motion.div
                      className="h-full bg-white/20"
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: autoDismissMs / 1000, ease: 'linear' }}
                    />
                  </div>
                </div>

                <p className="text-center text-[10px] font-mono font-black text-slate-400 mt-4 uppercase tracking-widest opacity-50">
                  Link active in {autoDismissMs / 1000}s
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
