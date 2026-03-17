import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Zap, Clock, Lightbulb, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    icon: Zap, title: 'Scoring', color: 'text-primary',
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
    icon: Clock, title: 'Timer', color: 'text-warning',
    desc: '90 seconds per level. Timer goes red under 20s and auto-submits when expired. Stay sharp and manage your time wisely!'
  },
  {
    icon: Lightbulb, title: 'Hints', color: 'text-warning',
    desc: '2 hints per level. Each costs -5 pts. Use them wisely — they can save you from a wrong answer but at a cost!'
  },
  {
    icon: Trophy, title: 'Final Ratings', color: 'text-primary',
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 200 }}
            onClick={e => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl p-0 max-w-lg w-full overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                <h2 className="text-lg font-heading font-bold text-primary">Mission Briefing</h2>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-foreground/80 font-mono leading-relaxed mb-5">
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
                  className="bg-secondary/30 border border-border/50 rounded-xl p-5 min-h-[180px]"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <section.icon size={18} className={section.color} />
                    <h3 className="text-sm font-heading font-bold text-foreground">{section.title}</h3>
                  </div>
                  {section.desc && (
                    <p className="text-xs font-mono text-muted-foreground leading-relaxed">{section.desc}</p>
                  )}
                  {section.items && (
                    <div className="space-y-2">
                      {section.items.map(item => (
                        <motion.div
                          key={item.text}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex justify-between text-xs font-mono"
                        >
                          <span className="text-muted-foreground">{item.text}</span>
                          <span className={`font-bold ${item.color}`}>{item.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Pagination dots + Nav */}
              <div className="flex items-center justify-between mt-5">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 0}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-mono font-bold border border-border bg-secondary/50 text-foreground hover:neon-border hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                <div className="flex gap-2">
                  {SECTIONS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        i === page ? 'bg-primary scale-125 box-glow' : 'bg-secondary hover:bg-muted-foreground'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => page < SECTIONS.length - 1 ? setPage(p => p + 1) : onClose()}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-mono font-bold border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                >
                  {page < SECTIONS.length - 1 ? <>Next <ChevronRight size={14} /></> : 'Got it! ✓'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
