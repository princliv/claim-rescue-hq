import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHUD from './GameHUD';
import InstructorFeedback from './InstructorFeedback';
import { useLevelTimer } from '@/hooks/useLevelTimer';
import { LevelResult } from '@/types/game';
import QuestionInstructionModal from './QuestionInstructionModal';
import { CheckCircle, XCircle, Layers, FileText, Check, X, Scale, Lightbulb } from 'lucide-react';

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
    else { setFeedback('wrong'); }

    setInstructorMsg({ correct: isCorrect, text: q.explanation });

    setTimeout(() => {
      setFeedback(null); setShowHint(''); setSelectedIdx(null); setInstructorMsg(null);
      if (currentQ < QUESTIONS.length - 1) setCurrentQ(c => c + 1);
      else finish(score + pts, isCorrect ? correctCount + 1 : correctCount);
    }, FEEDBACK_DELAY);
  };

  const handleHint = () => { if (hintsUsed < 2) { setShowHint(HINTS[hintsUsed]); setScore(s => s - 5); setHintsUsed(h => h + 1); } };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <QuestionInstructionModal visible={showInstruction} type="select-one" onDismiss={() => setShowInstruction(false)} autoDismissMs={5000} />
      <GameHUD level={5} title="Multi-Service Manager" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />

      <div className={`flex-1 p-6 relative z-10`}>
        {/* Header */}
        <div className="flex items-center gap-2 justify-center mb-6">
          <Layers size={16} className="text-primary" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Dual Service Analysis — Case #CR-2024-005</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto mb-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl overflow-hidden shadow-sm relative">
            <div className="px-5 py-3 bg-primary/10 border-b border-primary/20 flex items-center gap-2">
              <FileText size={14} className="text-primary" />
              <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest">Service 1 — MRI Spine</span>
              <div className="ml-auto status-dot" />
            </div>
            {isLoading ? (
              <div className="p-5 space-y-4 animate-pulse">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-3 w-16 rounded bg-secondary" />
                    <div className="h-4 w-24 rounded bg-primary/10" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 space-y-3 text-sm font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Patient:</span> 
                  <span className="font-semibold text-foreground">Ahmed T</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">DX:</span> 
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold tracking-tight">M54.5</span>
                    <span className="text-xs text-muted-foreground font-normal">(Back pain)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Denial:</span> 
                  <span className="px-2 py-0.5 rounded-md bg-warning/10 text-warning border border-warning/20 font-bold tracking-tight">04@</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Auth:</span> 
                  <span className="px-2 py-0.5 rounded-md bg-success/10 text-success border border-success/20 font-bold tracking-tight shadow-sm flex items-center gap-1"><Check size={12}/> Found</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">DX Match:</span> 
                  <span className="px-2 py-0.5 rounded-md bg-success/10 text-success border border-success/20 font-bold tracking-tight shadow-sm flex items-center gap-1"><Check size={12}/> Yes</span>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl overflow-hidden shadow-sm relative">
            <div className="px-5 py-3 bg-warning/10 border-b border-warning/20 flex items-center gap-2">
              <FileText size={14} className="text-warning" />
              <span className="text-xs font-mono text-warning font-bold uppercase tracking-widest">Service 2 — Blood Test</span>
              <div className="ml-auto status-dot status-dot-danger" />
            </div>
            {isLoading ? (
              <div className="p-5 space-y-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-3 w-16 rounded bg-secondary" />
                    <div className="h-4 w-24 rounded bg-warning/10" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 space-y-3 text-sm font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Patient:</span> 
                  <span className="font-semibold text-foreground">Ahmed T</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">DX:</span> 
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold tracking-tight">E11.9</span>
                    <span className="text-xs text-muted-foreground font-normal">(Diabetes)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Denial:</span> 
                  <span className="px-2 py-0.5 rounded-md bg-warning/10 text-warning border border-warning/20 font-bold tracking-tight">15C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Auth:</span> 
                  <span className="px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 font-bold tracking-tight shadow-sm flex items-center gap-1"><X size={12}/> Not found</span>
                </div>
              </div>
            )}
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
                className="glass-card rounded-xl p-6">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-bold inline-block mb-3 ${
                  QUESTIONS[currentQ].isFinal ? 'bg-warning/15 text-warning border border-warning/30' : 'bg-primary/10 text-primary border border-primary/20'
                }`}>
                  {QUESTIONS[currentQ].isFinal ? <><Scale size={12} /> FINAL RULING</> : `PHASE ${currentQ + 1}`}
                </div>
                {QUESTIONS[currentQ].isFinal ? (
                  <div className="text-center py-4">
                    <p className="text-xl font-heading font-bold text-foreground mb-6">{QUESTIONS[currentQ].question}</p>
                    <div className="flex gap-4 justify-center">
                      {QUESTIONS[currentQ].options.map((opt, i) => {
                        const isSelected = selectedIdx === i;
                        const isCorrectOpt = i === QUESTIONS[currentQ].correct;
                        const showCorrect = feedback && isCorrectOpt;
                        const showWrong = feedback === 'wrong' && isSelected && !isCorrectOpt;
                        return (
                          <motion.button
                            key={i}
                            whileHover={!feedback ? { scale: 1.05 } : {}}
                            whileTap={!feedback ? { scale: 0.95 } : {}}
                            onClick={() => handleAnswer(i)}
                            disabled={feedback !== null}
                            className={`flex-1 flex flex-col items-center justify-center gap-2 p-5 rounded-xl font-mono text-base transition-all border ${
                              showCorrect ? 'bg-success/10 border-success/50 text-success shadow-md'
                              : showWrong ? 'bg-destructive/10 border-destructive/50 text-destructive shadow-md'
                              : 'border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 text-foreground'
                            }`}
                          >
                            {opt}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-heading font-semibold text-foreground mb-5">{QUESTIONS[currentQ].question}</p>
                    <div className="space-y-2.5">
                      {QUESTIONS[currentQ].options.map((opt, i) => {
                        const isCorrectOpt = i === QUESTIONS[currentQ].correct;
                        const showCorrect = feedback && isCorrectOpt;
                        const showWrong = feedback === 'wrong' && selectedIdx === i && !isCorrectOpt;
                        return (
                          <motion.button key={i} whileHover={!feedback ? { scale: 1.02, x: 4 } : {}} onClick={() => handleAnswer(i)} disabled={feedback !== null}
                            className={`w-full flex items-center gap-3 text-left px-5 py-3.5 rounded-xl font-mono text-sm transition-all border ${
                              showCorrect ? 'bg-success/10 border-success/50 text-success'
                              : showWrong ? 'bg-destructive/10 border-destructive/50 text-destructive'
                              : 'border-border bg-secondary/30 hover:border-primary/40 hover:text-primary text-foreground'
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
                  </>
                )}
              </motion.div>
            </AnimatePresence>
        </div>

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
