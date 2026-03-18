import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle, MousePointer2, Eye, Search, Hand, FileText } from 'lucide-react';

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
    icon: <MousePointer2 size={40} className="text-muted-foreground mx-auto" />,
    title: 'Select One Answer',
    subtitle: 'Read the question carefully, then tap the best choice.',
    steps: ['Read the claim scenario above', 'Review each option', 'Tap the correct answer'],
    gesture: <SelectOneGesture />,
  },
  'drag-right': {
    icon: <Hand size={40} className="text-muted-foreground mx-auto" />,
    title: 'Pick the Right Card',
    subtitle: 'Select the evidence card that supports your decision.',
    steps: ['Review the claim details', 'Tap the card that applies', 'Confirm your final ruling'],
    gesture: <DragGesture />,
  },
  'tap-tabs': {
    icon: <MousePointer2 size={40} className="text-muted-foreground mx-auto" />,
    title: 'Explore Each Tab First',
    subtitle: 'Open all system tabs, then answer the questions.',
    steps: ['Click each tab to reveal data', 'All 4 tabs must be visited', 'Then answer each question'],
    gesture: <TabGesture />,
  },
  'compare-select': {
    icon: <Search size={40} className="text-muted-foreground mx-auto" />,
    title: 'Compare & Decide',
    subtitle: 'Examine both documents side-by-side, then choose.',
    steps: ['Read left panel (Claim)', 'Read right panel (Auth)', 'Spot the mismatch & answer'],
    gesture: <CompareGesture />,
  },
};

/* ── Gesture Animations ─────────────────────────────────── */

function SelectOneGesture() {
  return (
    <div className="relative w-48 h-28 mx-auto">
      {/* Answer options */}
      {['Option A', 'Option B', 'Option C'].map((label, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className={`absolute left-0 right-8 h-7 rounded-lg border text-xs font-mono flex items-center px-3 ${
            i === 1
              ? 'border-primary bg-primary/10 text-primary font-bold'
              : 'border-border bg-secondary/40 text-muted-foreground'
          }`}
          style={{ top: i * 34 }}
        >
          {label}
          {i === 1 && <CheckCircle size={12} className="ml-auto text-primary" />}
        </motion.div>
      ))}
      {/* Animated finger */}
      <motion.div
        className="absolute right-0 text-muted-foreground select-none"
        initial={{ y: 0, x: 0 }}
        animate={{ y: [0, 34, 34, 0], x: [0, 0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
        style={{ top: 8, right: 10 }}
      >
        <MousePointer2 size={24} className="fill-muted-foreground/30" />
      </motion.div>
    </div>
  );
}

function DragGesture() {
  return (
    <div className="relative w-48 h-28 mx-auto flex items-center justify-center">
      <div className="flex items-center gap-4">
        {/* Card */}
        <motion.div
          className="w-20 h-16 rounded-xl border-2 border-primary bg-primary/5 flex flex-col items-center justify-center gap-1"
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }}
        >
          <FileText size={20} className="text-primary" />
          <span className="text-[10px] font-mono text-primary font-bold">CARD</span>
        </motion.div>
        {/* Arrow */}
        <motion.div
          className="text-primary font-bold text-xl"
          animate={{ x: [0, 4, 0], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.5 }}
        >
          →
        </motion.div>
        {/* Target zone */}
        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
          <span className="text-[10px] font-mono text-muted-foreground text-center">DROP<br/>ZONE</span>
        </div>
      </div>
      {/* Finger */}
      <motion.div
        className="absolute text-muted-foreground select-none"
        style={{ bottom: 8, left: 32 }}
        animate={{ x: [0, 48, 48, 0], opacity: [1, 1, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
      >
        <MousePointer2 size={24} className="fill-muted-foreground/30 -rotate-12" />
      </motion.div>
    </div>
  );
}

function TabGesture() {
  const tabs = ['📋 Claim', '🏥 Auth', '💊 Rx', '📁 Hist'];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % tabs.length), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-52 h-28 mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 mb-1">
        {tabs.map((tab, i) => (
          <motion.div
            key={tab}
            animate={{ borderColor: i === active ? 'hsl(221 83% 53%)' : 'hsl(220 13% 91%)' }}
            className="flex-1 h-7 rounded-t-lg border text-[9px] font-mono flex items-center justify-center transition-colors"
            style={{
              background: i === active ? 'hsl(221 83% 53% / 0.08)' : 'hsl(220 14% 96%)',
              color: i === active ? 'hsl(221 83% 53%)' : 'hsl(220 9% 46%)',
              fontWeight: i === active ? 700 : 400,
            }}
          >
            {tab.split(' ')[0]}
          </motion.div>
        ))}
      </div>
      {/* Content area */}
      <div className="h-12 rounded-b-lg rounded-tr-lg border bg-white flex items-center justify-center">
        <span className="text-[10px] font-mono text-muted-foreground">{tabs[active]} data…</span>
      </div>
      {/* Bouncing finger */}
      <motion.div
        className="absolute text-muted-foreground select-none"
        style={{ bottom: 2, left: active * 50 + 12 }}
        animate={{ bottom: [2, 14, 2] }}
        transition={{ duration: 0.45, repeat: Infinity }}
      >
        <MousePointer2 size={20} className="fill-muted-foreground/30" />
      </motion.div>
    </div>
  );
}

function CompareGesture() {
  return (
    <div className="relative w-52 h-28 mx-auto flex items-center gap-3">
      {/* Left doc */}
      <div className="flex-1 h-20 rounded-lg border border-primary/30 bg-primary/5 p-2">
        <div className="text-[9px] font-mono text-primary font-bold mb-1">📋 CLAIM</div>
        {[70, 50, 85].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full bg-primary/20 mb-1" style={{ width: `${w}%` }} />
        ))}
        <motion.div
          className="h-1.5 rounded-full bg-destructive/60 mb-1"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ width: '60%' }}
        />
      </div>

      {/* Eyes / compare icon */}
      <motion.div
        className="text-muted-foreground"
        animate={{ x: [-4, 4, -4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Eye size={24} />
      </motion.div>

      {/* Right doc */}
      <div className="flex-1 h-20 rounded-lg border border-success/30 bg-success/5 p-2">
        <div className="text-[9px] font-mono text-success font-bold mb-1">🔐 AUTH</div>
        {[70, 50, 85].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full bg-success/20 mb-1" style={{ width: `${w}%` }} />
        ))}
        <motion.div
          className="h-1.5 rounded-full bg-success/60 mb-1"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
          style={{ width: '90%' }}
        />
      </div>
    </div>
  );
}

/* ── Main Modal ─────────────────────────────────────────── */

export default function QuestionInstructionModal({ visible, type, onDismiss, autoDismissMs = 6000 }: Props) {
  const config = CONFIGS[type];

  // Auto-dismiss after N ms
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm p-4"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            onClick={e => e.stopPropagation()}
            className="bg-white border rounded-2xl shadow-xl max-w-sm w-full overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1 bg-primary w-full" />

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}
                  className="mb-3"
                >
                  {config.icon}
                </motion.div>
                <h2 className="text-lg font-heading font-bold text-foreground">{config.title}</h2>
                <p className="text-xs font-mono text-muted-foreground mt-1">{config.subtitle}</p>
              </div>

              {/* Gesture animation */}
              <div className="bg-secondary/30 rounded-xl p-4 mb-5 border">
                {config.gesture}
              </div>

              {/* Steps */}
              <div className="space-y-2 mb-5">
                {config.steps.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 text-xs font-mono text-foreground"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    {step}
                  </motion.div>
                ))}
              </div>

              {/* Dismiss button + auto-dismiss bar */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDismiss}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading font-semibold text-sm"
                >
                  Got it — Start Questions
                </motion.button>
                {/* Progress bar showing auto-dismiss */}
                <motion.div
                  className="absolute bottom-0 left-0 h-full bg-white/20 rounded-lg pointer-events-none"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: autoDismissMs / 1000, ease: 'linear' }}
                />
              </div>

              <p className="text-center text-[10px] font-mono text-muted-foreground mt-2">
                Auto-continues in {autoDismissMs / 1000}s · Tap anywhere to skip
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
