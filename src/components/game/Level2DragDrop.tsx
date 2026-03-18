import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHUD from './GameHUD';
import InstructorFeedback from './InstructorFeedback';
import QuestionInstructionModal from './QuestionInstructionModal';
import { useLevelTimer } from '@/hooks/useLevelTimer';
import { LevelResult } from '@/types/game';
import { FileText, Search, Archive, Trash2, CheckCircle, XCircle, Hash, Tag, Lock, Pill, Calendar, X, Scale, Lightbulb } from 'lucide-react';

interface Props { onComplete: (result: LevelResult) => void; }

interface ClueCard { id: string; text: string; target: 'findings' | 'evidence' | 'discard'; icon: React.ReactNode; explanation: string; }

const CLUE_CARDS: ClueCard[] = [
  { id: 'c1', text: 'Denial code starts with 15', target: 'findings', icon: <Hash size={14} />, explanation: 'Denial prefix "15" indicates an NCD-related denial — this is a key finding for your investigation.' },
  { id: 'c2', text: 'NCD ID has NA prefix', target: 'findings', icon: <Tag size={14} />, explanation: 'The "NA" prefix in the NCD ID confirms this is a National Coverage Determination case.' },
  { id: 'c3', text: 'No Authorization in CAS', target: 'evidence', icon: <Lock size={14} />, explanation: 'No authorization in the CAS system is critical evidence — without auth, you cannot override NCD denials.' },
  { id: 'c4', text: 'DX R51 is general headache', target: 'findings', icon: <Pill size={14} />, explanation: 'R51 is a general/unspecified headache code — a key finding that shows the DX may not meet NCD requirements.' },
  { id: 'c5', text: 'Billing date is correct', target: 'discard', icon: <Calendar size={14} />, explanation: 'Billing date being correct is routine — it doesn\'t help prove or disprove the NCD denial.' },
];

const DECISION_EXPLANATION = 'No authorization exists and the DX is a general headache code that doesn\'t meet NCD criteria. The denial must be upheld.';

const HINTS = ["Look for 'NA' in the NCD ID field", 'No auth = no override possible'];

const FEEDBACK_DELAY = 2500;

export default function Level2DragDrop({ onComplete }: Props) {
  const [pool, setPool] = useState(CLUE_CARDS.map(c => c.id));
  const [findings, setFindings] = useState<string[]>([]);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [discarded, setDiscarded] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<'sort' | 'decision'>('sort');
  const [lastFeedback, setLastFeedback] = useState<{ correct: boolean; cardId: string } | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [instructorMsg, setInstructorMsg] = useState<{ correct: boolean; text: string } | null>(null);
  const [showInstruction, setShowInstruction] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const timer = useLevelTimer(90);

  useEffect(() => {
    if (!showInstruction) {
      setTimeout(() => setIsLoading(false), 800);
      timer.start();
    }
  }, [showInstruction]);

  const finish = useCallback((fs: number, fc: number) => {
    timer.stop();
    const elapsed = timer.getElapsed();
    onComplete({ level: 2, score: Math.max(0, fs + (elapsed < 60 ? 20 : 0)), time: elapsed, totalQuestions: 5, correctAnswers: fc, hintsUsed });
  }, [timer, hintsUsed, onComplete]);

  useEffect(() => { if (timer.isExpired) finish(score, correctCount); }, [timer.isExpired]);

  const handleDrop = (zone: 'findings' | 'evidence' | 'discard') => {
    if (!selectedCard) return;
    const card = CLUE_CARDS.find(c => c.id === selectedCard);
    if (!card) return;

    setPool(p => p.filter(id => id !== selectedCard));
    if (zone === 'findings') setFindings(f => [...f, selectedCard]);
    else if (zone === 'evidence') setEvidence(e => [...e, selectedCard]);
    else setDiscarded(d => [...d, selectedCard]);

    const isCorrect = card.target === zone;
    if (isCorrect) { setScore(s => s + 10); setCorrectCount(c => c + 1); }
    else { setScore(s => s - 5); }
    setLastFeedback({ correct: isCorrect, cardId: selectedCard });
    setInstructorMsg({ correct: isCorrect, text: card.explanation });
    setTimeout(() => { setLastFeedback(null); setInstructorMsg(null); }, FEEDBACK_DELAY);
    setSelectedCard(null);

    if (pool.length <= 1) setTimeout(() => setPhase('decision'), FEEDBACK_DELAY + 300);
  };

  const handleDecision = (override: boolean) => {
    const correct = !override;
    setInstructorMsg({ correct, text: DECISION_EXPLANATION });
    if (correct) { setScore(s => s + 50); setCorrectCount(c => c + 1); }
    else { setScore(s => s - 30); }
    setTimeout(() => {
      setInstructorMsg(null);
      finish(correct ? score + 50 : score - 30, correct ? correctCount + 1 : correctCount);
    }, FEEDBACK_DELAY);
  };

  const handleHint = () => { if (hintsUsed < 2) { setShowHint(HINTS[hintsUsed]); setScore(s => s - 5); setHintsUsed(h => h + 1); } };

  const zones = [
    { key: 'findings' as const, label: 'FINDINGS', icon: Search, items: findings, color: 'text-primary', borderColor: 'border-primary/30' },
    { key: 'evidence' as const, label: 'EVIDENCE', icon: Archive, items: evidence, color: 'text-success', borderColor: 'border-success/30' },
    { key: 'discard' as const, label: 'DISCARD', icon: Trash2, items: discarded, color: 'text-destructive', borderColor: 'border-destructive/30' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <QuestionInstructionModal
        visible={showInstruction}
        type="drag-right"
        onDismiss={() => setShowInstruction(false)}
        autoDismissMs={5000}
      />
      <GameHUD level={2} title="NCD Case Investigation" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />

      <div className={`flex-1 p-6 relative z-10`}>
        {/* Scenario */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5 mb-6 max-w-5xl mx-auto relative overflow-hidden">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded bg-primary/20" />
                <div className="h-4 w-48 rounded bg-secondary" />
                <div className="w-2 h-2 rounded-full bg-secondary ml-auto" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex gap-2 items-center">
                     <div className="h-3 w-16 rounded bg-secondary" />
                     <div className="h-4 w-20 rounded bg-primary/10" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-primary" />
                <h3 className="text-xs font-mono text-primary uppercase tracking-widest">Claim File — Case #CR-2024-002</h3>
                <div className="status-dot ml-auto" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Patient:</span>
                  <span className="text-foreground font-semibold">Maria S</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Procedure:</span>
                  <span className="text-foreground font-semibold">MRI Brain</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">DX:</span>
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold tracking-tight">R51</span>
                  <span className="text-xs text-muted-foreground">(Headache)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Denial:</span>
                  <span className="px-2 py-0.5 rounded-md bg-warning/10 text-warning border border-warning/20 font-bold tracking-tight">15B</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">NCD ID:</span>
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold tracking-tight">NA-123</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Auth:</span>
                  <span className="px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 font-bold tracking-tight shadow-sm flex items-center gap-1"><X size={12} /> Not found</span>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {phase === 'sort' ? (
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-mono text-muted-foreground mb-5 text-center">
              Select a clue card, then click the correct zone to place it
            </p>

            {/* Pool */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <AnimatePresence>
                {pool.map(id => {
                  const card = CLUE_CARDS.find(c => c.id === id)!;
                  return (
                    <motion.button
                      key={id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCard(selectedCard === id ? null : id)}
                      className={`px-5 py-3 rounded-xl font-mono text-xs border transition-all flex items-center gap-2 ${
                        selectedCard === id
                          ? 'border-primary bg-primary/5 text-primary shadow-sm'
                          : 'border-border glass-card text-foreground hover:border-primary/40'
                      }`}
                    >
                      <span className="text-muted-foreground mr-1 flex items-center justify-center">{card.icon}</span>
                      {card.text}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Drop zones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {zones.map(zone => (
                <motion.button
                  key={zone.key}
                  whileHover={selectedCard ? { scale: 1.02 } : {}}
                  onClick={() => handleDrop(zone.key)}
                  className={`border-2 border-dashed rounded-xl p-5 min-h-[140px] transition-all text-left ${
                    selectedCard
                      ? `${zone.borderColor} hover:bg-secondary/30 cursor-pointer`
                      : 'border-border/50 cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <zone.icon size={16} className={zone.color} />
                    <p className={`text-xs font-mono uppercase tracking-widest font-bold ${zone.color}`}>{zone.label}</p>
                    <span className="ml-auto text-xs font-mono text-muted-foreground">{zone.items.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {zone.items.map(id => (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-xs font-mono rounded-lg px-3 py-1.5 border ${
                          zone.key === 'findings' ? 'bg-primary/10 border-primary/20 text-primary'
                          : zone.key === 'evidence' ? 'bg-success/10 border-success/20 text-success'
                          : 'bg-destructive/10 border-destructive/20 text-destructive'
                        }`}
                      >
                        <div className="flex gap-2 items-center">
                          <span className="opacity-70 flex-shrink-0">{CLUE_CARDS.find(c => c.id === id)?.icon}</span>
                          <span>{CLUE_CARDS.find(c => c.id === id)?.text}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto glass-card rounded-xl p-6 text-center">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-warning/15 text-warning border border-warning/30 text-xs font-mono font-bold inline-block mb-4">
              <Scale size={12} /> FINAL RULING
            </div>
            <p className="text-lg font-heading font-semibold text-foreground mb-6">What is your ruling?</p>
            <div className="flex gap-3">
              {['Override Denial', 'Uphold Denial'].map((opt, i) => (
                <motion.button key={opt} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDecision(i === 0)}
                  className="flex-1 px-4 py-3.5 bg-secondary/30 text-foreground rounded-xl font-mono text-sm border hover:border-primary/40 hover:text-primary transition-all">
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showHint && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto mt-4 p-3 bg-warning/10 border border-warning/30 rounded-xl text-warning text-xs font-mono flex items-center gap-2">
              <Lightbulb size={14} className="flex-shrink-0" /> {showHint}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <InstructorFeedback
        visible={!!instructorMsg}
        isCorrect={instructorMsg?.correct ?? true}
        explanation={instructorMsg?.text ?? ''}
      />
    </div>
  );
}
