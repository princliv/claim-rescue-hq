import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Zap, Clock, Trophy, ChevronLeft, ChevronRight, Activity, MousePointer2, Hand, Eye, TerminalSquare, Layers } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    icon: Zap, title: 'Scoring & Rules', color: 'text-primary',
    desc: 'You have 90 seconds per case. Timer automatically submits when expired.',
    items: [
      { text: 'Correct step action', value: '+10 pts', color: 'text-success' },
      { text: 'Correct final decision', value: '+50 pts', color: 'text-success' },
      { text: 'Wrong step', value: '-5 pts', color: 'text-destructive' },
      { text: 'Wrong final decision', value: '-30 pts', color: 'text-destructive' },
      { text: 'Speed bonus (under 60s)', value: '+20 pts', color: 'text-primary' },
      { text: 'Hint used', value: '-5 pts', color: 'text-warning' },
    ]
  },
  {
    icon: Activity, title: 'Phase 1: Foundation', color: 'text-primary',
    levelDetails: [
      { 
        level: 'Case 1: LCD Denial',
        action: 'Single Choice', 
        icon: MousePointer2,
        desc: 'Read the initial claim and identify standard LCD denial flags. Tap to select the correct answers during investigation.'
      },
      { 
        level: 'Case 2: NCD Investigation',
        action: 'Drag & Drop', 
        icon: Hand,
        desc: 'Sort evidence into Findings, Evidence, or Discard. Drag clue cards to organize and build your case for an NCD denial.'
      }
    ]
  },
  {
    icon: Activity, title: 'Phase 2: Advanced Systems', color: 'text-warning',
    levelDetails: [
      { 
        level: 'Case 3: Auth Override',
        action: 'Terminal Tabs', 
        icon: TerminalSquare,
        desc: 'Connect to external systems (CAS, CGX 2.0). Tap through system tabs to locate missing prior authorization.'
      },
      { 
        level: 'Case 4: DX Mismatch',
        action: 'Comparison', 
        icon: Eye,
        desc: 'Compare the claim side-by-side with the auth record. Look closely to spot mismatched Diagnosis (DX) codes.'
      },
      { 
        level: 'Case 5: Multi-Service Analysis',
        action: 'Split Screen', 
        icon: Layers,
        desc: 'Analyze a single claim with multiple service lines. Remember: one valid auth does NOT cover every service line!'
      }
    ]
  },
  {
    icon: Trophy, title: 'Final Ratings', color: 'text-primary',
    desc: 'Your total score across all 5 cases determines your final analyst rating.',
    items: [
      { text: '500-600 pts', value: '🟢 Expert Analyst', color: 'text-success' },
      { text: '300-499 pts', value: '🟡 Intermediate', color: 'text-warning' },
      { text: '0-299 pts', value: '🔴 Beginner', color: 'text-destructive' },
    ]
  },
];

export default function HowToPlayModal({ open, onClose }: Props) {
  const [page, setPage] = useState(0);

  const section = SECTIONS[page];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 200 }}
            onClick={e => e.stopPropagation()}
            className="bg-white border rounded-2xl p-0 max-w-3xl w-full overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                <h2 className="text-lg font-heading font-bold text-foreground">Training Guide</h2>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-sm text-foreground/80 font-mono leading-relaxed mb-6">
                You are a <span className="text-primary font-bold">Medicare Claims Analyst</span>. Investigate denied claims across 5 increasingly complex levels.
              </p>

              {/* Card content with animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25 }}
                  className="bg-secondary/30 border border-border/50 rounded-xl p-6 min-h-[220px]"
                >
                  <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
                    <section.icon size={20} className={section.color} />
                    <h3 className="text-base font-heading font-bold text-foreground">{section.title}</h3>
                  </div>
                  
                  {section.desc && (
                    <p className="text-sm font-mono text-muted-foreground leading-relaxed mb-5">{section.desc}</p>
                  )}
                  
                  {section.items && (
                    <div className="space-y-3">
                      {section.items.map(item => (
                        <motion.div
                          key={item.text}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex justify-between text-sm font-mono border-b border-border/30 pb-2 last:border-0"
                        >
                          <span className="text-muted-foreground">{item.text}</span>
                          <span className={`font-bold ${item.color}`}>{item.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {section.levelDetails && (
                    <div className="space-y-4">
                      {section.levelDetails.map((lvl, i) => (
                        <motion.div 
                          key={lvl.level}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-4 items-start bg-white p-4 rounded-lg border border-border/50 shadow-sm"
                        >
                          <div className={`mt-0.5 p-2 rounded-lg bg-secondary/50 flex-shrink-0 border border-border/50 ${section.color}`}>
                            <lvl.icon size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-bold font-mono text-foreground capitalize">{lvl.level}</h4>
                              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-bold">
                                {lvl.action}
                              </span>
                            </div>
                            <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                              {lvl.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Pagination dots + Nav */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 0}
                  className="flex items-center gap-1 px-5 py-2.5 rounded-lg text-sm font-mono border bg-secondary/50 text-foreground hover:border-primary/40 hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none font-bold"
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <div className="flex gap-2">
                  {SECTIONS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        i === page ? 'bg-primary scale-125' : 'bg-secondary hover:bg-muted-foreground'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => page < SECTIONS.length - 1 ? setPage(p => p + 1) : onClose()}
                  className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-sm font-mono font-bold border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all shadow-sm"
                >
                  {page < SECTIONS.length - 1 ? <>Next <ChevronRight size={16} /></> : 'Start Simulation ✓'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
