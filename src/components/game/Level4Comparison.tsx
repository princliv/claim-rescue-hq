import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHUD from './GameHUD';
import InstructorFeedback from './InstructorFeedback';
import { useLevelTimer } from '@/hooks/useLevelTimer';
import { LevelResult } from '@/types/game';
import QuestionInstructionModal from './QuestionInstructionModal';
import { AlertTriangle, CheckCircle, XCircle, FileText, Eye, Check, Scale, Lightbulb } from 'lucide-react';

interface Props { onComplete: (result: LevelResult) => void; }

const QUESTIONS = [
  { question: 'Is authorization present?', options: ['Yes', 'No'], correct: 0, isFinal: false,
    explanation: 'Authorization IS present — it was found in the system. But having auth alone isn\'t enough; you must also verify the DX match.' },
  { question: 'Does DX match authorization?', options: ['Yes', 'No'], correct: 1, isFinal: false,
    explanation: 'The claim DX is K21.9 (GERD) but the authorization DX is N20.0 (Kidney stone). These are completely different conditions — a clear mismatch!' },
  { question: 'What is the key rule here?', options: ['Any auth works', 'DX must match auth', 'Only procedure matters'], correct: 1, isFinal: false,
    explanation: 'The DX on the claim MUST match the DX on the authorization. Authorization for one condition cannot be used to override a denial for a different condition.' },
  { question: 'What is your ruling?', options: ['Override Denial', 'Uphold Denial'], correct: 1, isFinal: true,
    explanation: 'Even though authorization exists, the DX codes don\'t match (K21.9 vs N20.0). Without matching DX, the authorization is invalid for this claim. Deny.' },
];
const HINTS = ['Compare DX codes carefully between claim and auth', 'Authorization is useless if DX doesn\'t match'];

const FEEDBACK_DELAY = 2500;

export default function Level4Comparison({ onComplete }: Props) {
  const [compared, setCompared] = useState(false);
  const [phase, setPhase] = useState<'compare' | 'questions'>('compare');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [instructorMsg, setInstructorMsg] = useState<{ correct: boolean; text: string } | null>(null);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showQInstruction, setShowQInstruction] = useState(false);
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
    onComplete({ level: 4, score: Math.max(0, fs + (elapsed < 60 ? 20 : 0)), time: elapsed, totalQuestions: QUESTIONS.length, correctAnswers: fc, hintsUsed });
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
      <QuestionInstructionModal visible={showInstruction} type="compare-select" onDismiss={() => setShowInstruction(false)} autoDismissMs={5000} />
      <QuestionInstructionModal visible={showQInstruction} type="select-one" onDismiss={() => setShowQInstruction(false)} autoDismissMs={5000} />
      <GameHUD level={4} title="DX Mismatch Puzzle" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />

      <div className={`flex-1 p-6 relative z-10`}>
        {/* Side by side panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-6">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-xl p-5 relative overflow-hidden">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded bg-primary/20" />
                  <div className="h-4 w-32 rounded bg-secondary" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex justify-between items-center">
                       <div className="h-3 w-16 rounded bg-secondary" />
                       <div className="h-4 w-24 rounded bg-primary/10" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={16} className="text-primary" />
                  <h3 className="text-xs font-mono text-primary uppercase tracking-widest">📋 Claim Details</h3>
                </div>
                <div className="space-y-3 text-sm font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Patient:</span> 
                    <span className="font-semibold text-foreground">Lisa R</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Procedure:</span> 
                    <span className="font-semibold text-foreground">Ultrasound</span>
                  </div>
                  <motion.div
                    animate={compared ? { borderColor: 'hsl(0 76% 65% / 0.5)', backgroundColor: 'hsl(0 76% 65% / 0.1)' } : {}}
                    className="flex justify-between items-center p-2 rounded-lg border border-transparent transition-all -mx-2"
                  >
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">DX Code:</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-bold tracking-tight ${compared ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>K21.9</span>
                      <span className="text-xs font-normal text-muted-foreground">(GERD)</span>
                    </div>
                  </motion.div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Denial:</span> 
                    <span className="px-2 py-0.5 rounded-md bg-warning/10 text-warning border border-warning/20 font-bold tracking-tight">17B</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-xl p-5 relative overflow-hidden">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded bg-success/20" />
                  <div className="h-4 w-40 rounded bg-secondary" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center">
                       <div className="h-3 w-20 rounded bg-secondary" />
                       <div className="h-4 w-28 rounded bg-success/10" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={16} className="text-success" />
                  <h3 className="text-xs font-mono text-success uppercase tracking-widest">🔐 Authorization Details</h3>
                </div>
                <div className="space-y-3 text-sm font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Auth Status:</span> 
                    <span className="px-2 py-0.5 rounded-md bg-success/10 text-success border border-success/20 font-bold tracking-tight shadow-sm flex items-center gap-1"><Check size={12} /> Found</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Auth Procedure:</span> 
                    <span className="font-semibold text-foreground">Ultrasound</span>
                  </div>
                  <motion.div
                    animate={compared ? { borderColor: 'hsl(0 76% 65% / 0.5)', backgroundColor: 'hsl(0 76% 65% / 0.1)' } : {}}
                    className="flex justify-between items-center p-2 rounded-lg border border-transparent transition-all -mx-2"
                  >
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Auth DX:</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-bold tracking-tight ${compared ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>N20.0</span>
                      <span className="text-xs font-normal text-muted-foreground">(Kidney stone)</span>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Connection line when compared */}
        <AnimatePresence>
          {compared && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              className="max-w-5xl mx-auto mb-6"
            >
              <div className="flex items-center gap-3 justify-center p-3 bg-destructive/10 border border-destructive/30 rounded-xl">
                <AlertTriangle size={18} className="text-destructive" />
                <span className="font-mono text-sm text-destructive font-bold">MISMATCH DETECTED: K21.9 (GERD) ≠ N20.0 (Kidney stone)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === 'compare' ? (
          <div className="text-center">
            {!compared ? (
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 20px hsl(42 100% 50% / 0.3)' }} whileTap={{ scale: 0.95 }}
                onClick={() => setCompared(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-warning text-primary-foreground rounded-xl font-heading font-bold text-lg">
                <Eye size={20} /> Compare Fields
              </motion.button>
            ) : (
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }} onClick={() => { setPhase('questions'); setShowQInstruction(true); }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-heading font-semibold shadow-sm">
                Proceed to Questions →
              </motion.button>
            )}
          </div>
        ) : (
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
