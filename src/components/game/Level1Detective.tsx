import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHUD from './GameHUD';
import InstructorFeedback from './InstructorFeedback';
import { useLevelTimer } from '@/hooks/useLevelTimer';
import { LevelResult } from '@/types/game';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

interface Props { onComplete: (result: LevelResult) => void; }

const QUESTIONS = [
  { question: 'What should you check first?', options: ['Check Authorization', 'Check MHI Screen', 'Release Payment'], correct: 1, isFinal: false,
    explanation: 'Always check the MHI Screen first — it shows the denial reason, LCD/NCD flags, and applied rules before you investigate further.' },
  { question: 'What does denial code 04@ indicate?', options: ['Payment Processed', 'LCD/NCD Denial', 'Duplicate Claim'], correct: 1, isFinal: false,
    explanation: 'Denial code 04@ is an LCD/NCD denial indicator. The "04" prefix and "@" suffix flag a Local Coverage Determination issue.' },
  { question: 'Is authorization available?', options: ['Yes', 'No'], correct: 1, isFinal: false,
    explanation: 'The claim file clearly shows Authorization: ❌ Not found. Without authorization, LCD denials cannot be overridden.' },
  { question: 'What is your ruling?', options: ['Override Denial', 'Uphold Denial'], correct: 1, isFinal: true,
    explanation: 'No authorization + DX doesn\'t meet LCD criteria = the denial must be upheld. You cannot override without valid authorization.' },
];
const HINTS = ['Check the denial code prefix for clues', 'No authorization = cannot override LCD rule'];

const FEEDBACK_DELAY = 2500;

export default function Level1Detective({ onComplete }: Props) {
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
    onComplete({ level: 1, score: Math.max(0, fs + (elapsed < 60 ? 20 : 0)), time: elapsed, totalQuestions: QUESTIONS.length, correctAnswers: fc, hintsUsed });
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

  const handleHint = () => {
    if (hintsUsed < 2) { setShowHint(HINTS[hintsUsed]); setScore(s => s - 5); setHintsUsed(h => h + 1); }
  };

  const q = QUESTIONS[currentQ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 dot-grid-bg pointer-events-none" />
      <GameHUD level={1} title="Basic LCD Denial" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />
      
      <div className={`flex-1 flex items-center justify-center p-6 relative z-10 ${shake ? 'animate-shake' : ''}`}>
        <div className="max-w-2xl w-full">
          {/* Claim File Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-6 mb-6 corner-brackets"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-primary" />
              <h3 className="text-xs font-mono text-primary uppercase tracking-widest">Claim File — Case #CR-2024-001</h3>
              <div className="status-dot ml-auto" />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm font-mono">
              {[
                ['Patient', 'John D'],
                ['Procedure', 'Chest X-ray'],
                ['DX Code', 'Z00.00', '(General exam)', 'text-primary'],
                ['Denial Code', '04@', '', 'text-warning'],
                ['LCD Applied', 'Yes'],
                ['Authorization', '❌ Not found', '', 'text-destructive'],
              ].map(([label, value, sub, color]) => (
                <div key={label} className="flex items-baseline gap-2">
                  <span className="text-muted-foreground text-xs">{label}:</span>
                  <span className={`${color || 'text-foreground'} font-semibold`}>{value}</span>
                  {sub && <span className="text-muted-foreground text-xs">{sub}</span>}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Progress */}
          <div className="flex gap-1.5 mb-5">
            {QUESTIONS.map((_, i) => (
              <div key={i} className="flex-1 relative">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < currentQ ? 'bg-primary box-glow' : i === currentQ ? 'bg-primary/40' : 'bg-secondary'
                }`} />
                {i < currentQ && (
                  <CheckCircle size={12} className="text-primary absolute -top-1 right-0" />
                )}
              </div>
            ))}
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 30, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  q.isFinal ? 'bg-warning/15 text-warning border border-warning/30' : 'bg-primary/10 text-primary border border-primary/20'
                }`}>
                  {q.isFinal ? '⚖️ FINAL DECISION' : `STEP ${currentQ + 1}`}
                </div>
              </div>
              <p className="text-lg font-heading font-semibold text-foreground mb-5">{q.question}</p>

              <div className="space-y-2.5">
                {q.options.map((opt, i) => {
                  const isSelected = selectedIdx === i;
                  const isCorrectOpt = i === q.correct;
                  const showCorrect = feedback && isCorrectOpt;
                  const showWrong = feedback === 'wrong' && isSelected && !isCorrectOpt;
                  return (
                    <motion.button
                      key={i}
                      whileHover={!feedback ? { scale: 1.02, x: 4 } : {}}
                      whileTap={!feedback ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswer(i)}
                      disabled={feedback !== null}
                      className={`w-full flex items-center gap-3 text-left px-5 py-3.5 rounded-xl font-mono text-sm transition-all border ${
                        showCorrect
                          ? 'bg-success/15 border-success/50 text-success box-glow-success'
                          : showWrong
                            ? 'bg-destructive/15 border-destructive/50 text-destructive box-glow-danger'
                            : 'border-border bg-secondary/50 hover:neon-border hover:text-primary hover:bg-primary/5 text-foreground'
                      }`}
                    >
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

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-xl text-warning text-xs font-mono"
                  >
                    💡 {showHint}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <InstructorFeedback
        visible={!!instructorMsg}
        isCorrect={instructorMsg?.correct ?? true}
        explanation={instructorMsg?.text ?? ''}
      />
    </div>
  );
}
