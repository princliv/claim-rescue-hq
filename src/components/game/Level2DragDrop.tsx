import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHUD from './GameHUD';
import InstructorFeedback from './InstructorFeedback';
import { useLevelTimer } from '@/hooks/useLevelTimer';
import { LevelResult } from '@/types/game';
import { FileText, Search, Archive, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface Props { onComplete: (result: LevelResult) => void; }

interface ClueCard { id: string; text: string; target: 'findings' | 'evidence' | 'discard'; icon: string; explanation: string; }

const CLUE_CARDS: ClueCard[] = [
  { id: 'c1', text: 'Denial code starts with 15', target: 'findings', icon: '🔢', explanation: 'Denial prefix "15" indicates an NCD-related denial — this is a key finding for your investigation.' },
  { id: 'c2', text: 'NCD ID has NA prefix', target: 'findings', icon: '🏷️', explanation: 'The "NA" prefix in the NCD ID confirms this is a National Coverage Determination case.' },
  { id: 'c3', text: 'No Authorization in CAS', target: 'evidence', icon: '🔒', explanation: 'No authorization in the CAS system is critical evidence — without auth, you cannot override NCD denials.' },
  { id: 'c4', text: 'DX R51 is general headache', target: 'findings', icon: '💊', explanation: 'R51 is a general/unspecified headache code — a key finding that shows the DX may not meet NCD requirements.' },
  { id: 'c5', text: 'Billing date is correct', target: 'discard', icon: '📅', explanation: 'Billing date being correct is routine — it doesn\'t help prove or disprove the NCD denial.' },
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
  const [shake, setShake] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [instructorMsg, setInstructorMsg] = useState<{ correct: boolean; text: string } | null>(null);
  const timer = useLevelTimer(90);

  useEffect(() => { timer.start(); }, []);

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
    else { setScore(s => s - 5); setShake(true); setTimeout(() => setShake(false), 500); }
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 hex-pattern pointer-events-none" />
      <GameHUD level={2} title="NCD Case Investigation" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />

      <div className={`flex-1 p-6 relative z-10 ${shake ? 'animate-shake' : ''}`}>
        {/* Scenario */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-5 mb-6 max-w-5xl mx-auto corner-brackets">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-primary" />
            <h3 className="text-xs font-mono text-primary uppercase tracking-widest">Claim File — Case #CR-2024-002</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm font-mono">
            <div><span className="text-muted-foreground text-xs">Patient:</span> <span className="font-semibold">Maria S</span></div>
            <div><span className="text-muted-foreground text-xs">Procedure:</span> <span className="font-semibold">MRI Brain</span></div>
            <div><span className="text-muted-foreground text-xs">DX:</span> <span className="text-primary font-semibold">R51</span> <span className="text-xs text-muted-foreground">(Headache)</span></div>
            <div><span className="text-muted-foreground text-xs">Denial:</span> <span className="text-warning font-semibold">15B</span></div>
            <div><span className="text-muted-foreground text-xs">NCD ID:</span> <span className="text-primary font-semibold">NA-123</span></div>
            <div><span className="text-muted-foreground text-xs">Auth:</span> <span className="text-destructive font-semibold">❌ Not found</span></div>
          </div>
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
                          ? 'border-primary bg-primary/15 text-primary box-glow-strong scale-105'
                          : 'border-border bg-card/80 text-foreground hover:neon-border'
                      }`}
                    >
                      <span className="text-lg">{card.icon}</span>
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
                        {CLUE_CARDS.find(c => c.id === id)?.icon} {CLUE_CARDS.find(c => c.id === id)?.text}
                      </motion.div>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto bg-card/90 backdrop-blur-sm border border-border rounded-xl p-6 text-center corner-brackets">
            <div className="px-2 py-0.5 rounded bg-warning/15 text-warning border border-warning/30 text-xs font-mono font-bold inline-block mb-4">
              ⚖️ FINAL DECISION
            </div>
            <p className="text-lg font-heading font-semibold text-foreground mb-6">What is your ruling?</p>
            <div className="flex gap-3">
              {['Override Denial', 'Uphold Denial'].map((opt, i) => (
                <motion.button key={opt} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDecision(i === 0)}
                  className="flex-1 px-4 py-3.5 bg-secondary/50 text-foreground rounded-xl font-mono text-sm border border-border hover:neon-border hover:text-primary transition-all">
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showHint && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto mt-4 p-3 bg-warning/10 border border-warning/30 rounded-xl text-warning text-xs font-mono">
              💡 {showHint}
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
