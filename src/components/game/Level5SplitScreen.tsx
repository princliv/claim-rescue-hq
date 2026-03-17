import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHUD from './GameHUD';
import InstructorFeedback from './InstructorFeedback';
import { useLevelTimer } from '@/hooks/useLevelTimer';
import { LevelResult } from '@/types/game';
import { CheckCircle, XCircle, Layers, FileText } from 'lucide-react';

interface Props { onComplete: (result: LevelResult) => void; }

const QUESTIONS = [
  { question: 'Can multiple LCD/NCD rules apply to one claim?', options: ['No', 'Yes'], correct: 1, isFinal: false,
    explanation: 'Yes! A single claim can have multiple service lines, each with its own LCD or NCD rule. You must evaluate each service independently.' },
  { question: 'Decision for MRI Spine?', options: ['Deny', 'Override'], correct: 1, isFinal: false,
    explanation: 'MRI Spine has valid authorization AND matching DX (M54.5). Both criteria are met, so this service line should be overridden.' },
  { question: 'Decision for Blood Test?', options: ['Override', 'Deny'], correct: 1, isFinal: false,
    explanation: 'Blood Test has NO authorization found. Without auth, you cannot override the NCD denial regardless of the DX code.' },
  { question: 'Final outcome for the claim?', options: ['Pay All', 'Deny All', 'Partial Payment'], correct: 2, isFinal: true,
    explanation: 'MRI Spine = Override (auth + DX match) but Blood Test = Deny (no auth). One paid, one denied = Partial Payment.' },
];
const HINTS = ['Treat each service line independently', 'One valid auth doesn\'t cover all services'];

const FEEDBACK_DELAY = 2500;

export default function Level5SplitScreen({ onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [instructorMsg, setInstructorMsg] = useState<{ correct: boolean; text: string } | null>(null);
  const timer = useLevelTimer(90);

  useEffect(() => { timer.start(); }, []);

  const finish = useCallback((fs: number, fc: number) => {
    timer.stop();
    const elapsed = timer.getElapsed();
    onComplete({ level: 5, score: Math.max(0, fs + (elapsed < 60 ? 20 : 0)), time: elapsed, totalQuestions: QUESTIONS.length, correctAnswers: fc, hintsUsed });
  }, [timer, hintsUsed, onComplete]);

  useEffect(() => { if (timer.isExpired) finish(score, correctCount); }, [timer.isExpired]);

  const handleAnswer = (idx: number) => {
    if (feedback) return;
    setSelectedIdx(idx);
    const q = QUESTIONS[currentQ];
    const isCorrect = idx === q.correct;
    const pts = q.isFinal ? (isCorrect ? 50 : -30) : (isCorrect ? 10 : -5);
    setScore(s => s + pts);
    if (isCorrect) { setCorrectCount(c => c + 1); setFeedback('correct'); }
    else { setFeedback('wrong'); setShake(true); setTimeout(() => setShake(false), 500); }

    setInstructorMsg({ correct: isCorrect, text: q.explanation });

    setTimeout(() => {
      setFeedback(null); setShowHint(''); setSelectedIdx(null); setInstructorMsg(null);
      if (currentQ < QUESTIONS.length - 1) setCurrentQ(c => c + 1);
      else finish(score + pts, isCorrect ? correctCount + 1 : correctCount);
    }, FEEDBACK_DELAY);
  };

  const handleHint = () => { if (hintsUsed < 2) { setShowHint(HINTS[hintsUsed]); setScore(s => s - 5); setHintsUsed(h => h + 1); } };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 hex-pattern pointer-events-none" />
      <GameHUD level={5} title="Multi-Service Manager" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />

      <div className={`flex-1 p-6 relative z-10 ${shake ? 'animate-shake' : ''}`}>
        {/* Header */}
        <div className="flex items-center gap-2 justify-center mb-6">
          <Layers size={16} className="text-primary" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Dual Service Analysis — Case #CR-2024-005</span>
        </div>

        {/* Dual service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto mb-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            className="bg-card/90 backdrop-blur-sm border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-primary/10 border-b border-primary/20 flex items-center gap-2">
              <FileText size={14} className="text-primary" />
              <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest">Service 1 — MRI Spine</span>
              <div className="ml-auto status-dot" />
            </div>
            <div className="p-5 space-y-2.5 text-sm font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Patient:</span> <span className="font-semibold">Ahmed T</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">DX:</span> <span className="text-primary font-semibold">M54.5 <span className="text-xs text-muted-foreground font-normal">(Back pain)</span></span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Denial:</span> <span className="text-warning font-semibold">04@ (LCD)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Auth:</span> <span className="text-success font-semibold">✅ Found</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">DX Match:</span> <span className="text-success font-semibold">✅ Yes</span></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            className="bg-card/90 backdrop-blur-sm border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-warning/10 border-b border-warning/20 flex items-center gap-2">
              <FileText size={14} className="text-warning" />
              <span className="text-xs font-mono text-warning font-bold uppercase tracking-widest">Service 2 — Blood Test</span>
              <div className="ml-auto status-dot status-dot-danger" />
            </div>
            <div className="p-5 space-y-2.5 text-sm font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Patient:</span> <span className="font-semibold">Ahmed T</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">DX:</span> <span className="text-primary font-semibold">E11.9 <span className="text-xs text-muted-foreground font-normal">(Diabetes)</span></span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Denial:</span> <span className="text-warning font-semibold">15C (NCD)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Auth:</span> <span className="text-destructive font-semibold">❌ Not found</span></div>
            </div>
          </motion.div>
        </div>

        {/* Questions */}
        <div className="max-w-lg mx-auto">
          <div className="flex gap-1.5 mb-5">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i < currentQ ? 'bg-primary box-glow' : i === currentQ ? 'bg-primary/40' : 'bg-secondary'}`} />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-6 corner-brackets">
              <div className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold mb-3 ${
                QUESTIONS[currentQ].isFinal ? 'bg-warning/15 text-warning border border-warning/30' : 'bg-primary/10 text-primary border border-primary/20'
              }`}>
                {QUESTIONS[currentQ].isFinal ? '⚖️ FINAL DECISION' : `STEP ${currentQ + 1}`}
              </div>
              <p className="text-lg font-heading font-semibold text-foreground mb-5">{QUESTIONS[currentQ].question}</p>
              <div className="space-y-2.5">
                {QUESTIONS[currentQ].options.map((opt, i) => {
                  const isCorrectOpt = i === QUESTIONS[currentQ].correct;
                  const showCorrect = feedback && isCorrectOpt;
                  const showWrong = feedback === 'wrong' && selectedIdx === i && !isCorrectOpt;
                  return (
                    <motion.button key={i} whileHover={!feedback ? { scale: 1.02, x: 4 } : {}} onClick={() => handleAnswer(i)} disabled={feedback !== null}
                      className={`w-full flex items-center gap-3 text-left px-5 py-3.5 rounded-xl font-mono text-sm transition-all border ${
                        showCorrect ? 'bg-success/15 border-success/50 text-success box-glow-success'
                        : showWrong ? 'bg-destructive/15 border-destructive/50 text-destructive box-glow-danger'
                        : 'border-border bg-secondary/50 hover:neon-border hover:text-primary text-foreground'
                      }`}>
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        showCorrect ? 'bg-success/20 text-success' : showWrong ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {showCorrect ? <CheckCircle size={14} /> : showWrong ? <XCircle size={14} /> : String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

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
