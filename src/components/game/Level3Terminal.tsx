import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHUD from './GameHUD';
import InstructorFeedback from './InstructorFeedback';
import { useLevelTimer } from '@/hooks/useLevelTimer';
import { LevelResult } from '@/types/game';
import { Terminal, CheckCircle, XCircle, FileText, MonitorSmartphone } from 'lucide-react';

interface Props { onComplete: (result: LevelResult) => void; }

const TABS: Record<string, { label: string; icon: string; content: string[] }> = {
  MHI: { label: 'MHI System', icon: '📊', content: ['LCD applied: Yes', 'Denial Code: 17A', 'Modifier: LCD flagged'] },
  CAS: { label: 'CAS Portal', icon: '🔐', content: ['Authorization search...', 'Result: Authorization FOUND', 'Auth ID: CAS-8812'] },
  CGX: { label: 'CGX 2.0', icon: '⚡', content: ['CGX Authorization lookup...', 'Auth present: ✅ Yes', 'DX on auth: C34.1 (Lung cancer)', 'DX match: ✅ YES'] },
  RFI: { label: 'RFI Center', icon: '📋', content: ['No additional RFI required', 'All documents on file'] },
};

const QUESTIONS = [
  { question: 'Where should you check authorization?', options: ['Only CAS', 'CAS + CGX 2.0', 'Email'], correct: 1, isFinal: false,
    explanation: 'Always check both CAS and CGX 2.0 — authorization can exist in either system. Checking only one may miss valid auth.' },
  { question: 'Does DX match authorization?', options: ['Yes', 'No'], correct: 0, isFinal: false,
    explanation: 'The DX on the auth (C34.1 - Lung cancer) matches the claim DX exactly. This is critical for override eligibility.' },
  { question: 'Can denial be overridden?', options: ['Yes', 'No'], correct: 0, isFinal: false,
    explanation: 'Authorization exists AND the DX matches — both conditions are met, so this LCD denial can be overridden.' },
  { question: 'What is your ruling?', options: ['Override Denial', 'Uphold Denial'], correct: 0, isFinal: true,
    explanation: 'Valid authorization found in CGX 2.0 with matching DX code C34.1. All criteria met — override the denial.' },
];
const HINTS = ['Check ALL authorization systems, not just one', 'Matching DX is the key to override'];

const FEEDBACK_DELAY = 2500;

export default function Level3Terminal({ onComplete }: Props) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [visitedTabs, setVisitedTabs] = useState<string[]>([]);
  const [phase, setPhase] = useState<'explore' | 'questions'>('explore');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [instructorMsg, setInstructorMsg] = useState<{ correct: boolean; text: string } | null>(null);
  const timer = useLevelTimer(90);

  useEffect(() => { timer.start(); }, []);

  const finish = useCallback((fs: number, fc: number) => {
    timer.stop();
    const elapsed = timer.getElapsed();
    onComplete({ level: 3, score: Math.max(0, fs + (elapsed < 60 ? 20 : 0)), time: elapsed, totalQuestions: QUESTIONS.length, correctAnswers: fc, hintsUsed });
  }, [timer, hintsUsed, onComplete]);

  useEffect(() => { if (timer.isExpired) finish(score, correctCount); }, [timer.isExpired]);

  const openTab = (key: string) => {
    setActiveTab(key);
    if (!visitedTabs.includes(key)) setVisitedTabs(v => [...v, key]);
    setTypedLines([]);
    TABS[key].content.forEach((line, i) => {
      setTimeout(() => setTypedLines(l => [...l, line]), (i + 1) * 400);
    });
  };

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
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <GameHUD level={3} title="Authorization Override" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />

      <div className={`flex-1 p-6 relative z-10 ${shake ? 'animate-shake' : ''}`}>
        {/* Scenario */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-5 mb-6 max-w-5xl mx-auto corner-brackets">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-primary" />
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Claim File — Case #CR-2024-003</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm font-mono">
            <div><span className="text-muted-foreground text-xs">Patient:</span> <span className="font-semibold">David K</span></div>
            <div><span className="text-muted-foreground text-xs">Procedure:</span> <span className="font-semibold">CT Scan</span></div>
            <div><span className="text-muted-foreground text-xs">DX:</span> <span className="text-primary font-semibold">C34.1</span> <span className="text-xs text-muted-foreground">(Lung cancer)</span></div>
            <div><span className="text-muted-foreground text-xs">Denial:</span> <span className="text-warning font-semibold">17A</span></div>
            <div><span className="text-muted-foreground text-xs">LCD:</span> <span className="font-semibold">Yes</span></div>
            <div><span className="text-muted-foreground text-xs">Auth:</span> <span className="text-success font-semibold">✅ Found in CGX 2.0</span></div>
          </div>
        </motion.div>

        {phase === 'explore' ? (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <MonitorSmartphone size={14} className="text-primary" />
              <p className="text-xs font-mono text-muted-foreground">Access each system to gather intelligence</p>
            </div>
            <div className="flex gap-2 mb-0">
              {Object.keys(TABS).map(key => (
                <button key={key} onClick={() => openTab(key)}
                  className={`px-5 py-2.5 rounded-t-xl font-mono text-xs transition-all border-t border-l border-r flex items-center gap-2 ${
                    activeTab === key
                      ? 'bg-card border-border text-primary font-bold neon-border'
                      : visitedTabs.includes(key)
                        ? 'bg-secondary/50 border-border/50 text-success'
                        : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                  }`}>
                  <span>{TABS[key].icon}</span>
                  {visitedTabs.includes(key) && activeTab !== key && <CheckCircle size={10} />}
                  {TABS[key].label}
                </button>
              ))}
            </div>
            <div className="bg-background border border-border rounded-b-xl rounded-tr-xl p-5 min-h-[180px] font-mono text-sm scanline">
              {!activeTab ? (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Terminal size={14} className="text-primary animate-pulse" />
                  <span>Awaiting system access... Select a terminal tab above</span>
                  <span className="animate-pulse">▌</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-primary">{`> Connecting to ${TABS[activeTab].label}...`}</p>
                  <p className="text-success text-xs">Connection established ✓</p>
                  <div className="h-px bg-border my-2" />
                  {typedLines.map((line, i) => (
                    <motion.p key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
                      className={`text-foreground ${line.includes('✅') ? 'text-success' : ''}`}>
                      {`  > ${line}`}
                    </motion.p>
                  ))}
                  {typedLines.length > 0 && <span className="text-primary animate-pulse">▌</span>}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                {Object.keys(TABS).map(key => (
                  <div key={key} className={`w-2.5 h-2.5 rounded-full ${visitedTabs.includes(key) ? 'bg-success' : 'bg-secondary'}`} />
                ))}
                <span className="text-xs font-mono text-muted-foreground ml-2">{visitedTabs.length}/4 systems accessed</span>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setPhase('questions')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-heading font-bold box-glow-strong">
                Proceed to Questions →
              </motion.button>
            </div>
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
