import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHUD from './GameHUD';
import InstructorFeedback from './InstructorFeedback';
import { useLevelTimer } from '@/hooks/useLevelTimer';
import { LevelResult } from '@/types/game';
import QuestionInstructionModal from './QuestionInstructionModal';
import section2Bg from '@/assets/bg_section2.png';

// React Icons Imports
import { 
  MdLayers, 
  MdCheckCircle, 
  MdCancel, 
  MdOutlineScale, 
  MdFactCheck, 
  MdOutlineMedicalServices, 
  MdOutlineRule, 
  MdOutlineTableRows, 
  MdNavigateNext 
} from 'react-icons/md';
import { 
  BsFileMedicalFill, 
  BsShieldLockFill, 
  BsFillExclamationCircleFill, 
  BsGrid3X3GapFill, 
  BsActivity 
} from 'react-icons/bs';

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
    <div className="min-h-screen flex flex-col bg-[#0a0f18] relative overflow-hidden">
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40 mix-blend-screen scale-110 blur-[1px]"
        style={{ backgroundImage: `url(${section2Bg})` }}
      />
      <div className="absolute inset-0 bg-[#0a0f18] z-0" />

      <QuestionInstructionModal visible={showInstruction} type="select-one" onDismiss={() => setShowInstruction(false)} autoDismissMs={5000} />
      
      <GameHUD level={5} title="Multi-Service Manager" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />

      <div className={`flex-1 p-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col`}>
        {/* Dossier Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 mb-8 border border-white/20 shadow-2xl relative overflow-hidden">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
               <div className="h-6 w-1/4 rounded bg-slate-100" />
               <div className="h-4 w-full rounded bg-slate-50" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <MdLayers size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">Complex Claim Matrix</h3>
                  <span className="text-lg font-heading font-black text-slate-900 tracking-tight leading-none uppercase">Case #CR-2024-005 • Ahmed T.</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 font-mono font-black text-[10px] border border-slate-200 uppercase">Dual-Line Audit</span>
                 </div>
                 <div className="h-10 w-px bg-slate-100" />
                 <div className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest">Security</span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-600 font-mono font-black text-[10px] border border-emerald-100 uppercase flex items-center gap-1.5">
                       <BsActivity size={10} className="animate-pulse" /> Encrypted
                    </span>
                 </div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12 w-full">
          {/* Service Line 1 */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900/60 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="px-8 py-5 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                   <MdOutlineMedicalServices size={18} />
                 </div>
                 <span className="text-[11px] font-mono font-black text-white uppercase tracking-widest">Service Alpha — MRI Spine</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse" />
            </div>

            {isLoading ? (
               <div className="p-8 space-y-4 animate-pulse">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 w-full rounded bg-white/5" />)}
               </div>
            ) : (
              <div className="p-8 space-y-4 font-mono">
                 <div className="flex justify-between items-center px-2 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Diagnosis Match</span>
                    <div className="flex items-center gap-3">
                       <span className="text-[13px] font-black text-white tracking-tighter">M54.5 (Back Pain)</span>
                       <MdCheckCircle className="text-emerald-400" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Denial Vector</span>
                       <span className="text-[12px] font-black text-amber-500 uppercase tracking-widest">04@ Rule</span>
                    </div>
                    <div className="p-4 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20">
                       <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Authorization</span>
                       <span className="text-[12px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                          <BsShieldLockFill size={10} /> VALIDATED
                       </span>
                    </div>
                 </div>

                 <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <MdOutlineRule size={20} className="text-primary" />
                    <div>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">LCD Protocol Compliance</span>
                       <span className="text-[11px] font-black text-white uppercase tracking-widest">Match Identified ✓</span>
                    </div>
                 </div>
              </div>
            )}
          </motion.div>

          {/* Service Line 2 */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900/60 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="px-8 py-5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                   <MdOutlineMedicalServices size={18} />
                 </div>
                 <span className="text-[11px] font-mono font-black text-white uppercase tracking-widest">Service Beta — Blood Test</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)] animate-pulse" />
            </div>

            {isLoading ? (
               <div className="p-8 space-y-4 animate-pulse">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 w-full rounded bg-white/5" />)}
               </div>
            ) : (
              <div className="p-8 space-y-4 font-mono">
                 <div className="flex justify-between items-center px-2 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Diagnosis Match</span>
                    <div className="flex items-center gap-3">
                       <span className="text-[13px] font-black text-white tracking-tighter">E11.9 (Diabetes)</span>
                       <MdCheckCircle className="text-emerald-400" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Denial Vector</span>
                       <span className="text-[12px] font-black text-amber-500 uppercase tracking-widest">15C Rule</span>
                    </div>
                    <div className="p-4 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30">
                       <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest block mb-1">Authorization</span>
                       <span className="text-[12px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                          <MdCancel size={12} /> NOT FOUND
                       </span>
                    </div>
                 </div>

                 <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <MdOutlineRule size={20} className="text-rose-400" />
                    <div>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">NCD Protocol Breach</span>
                       <span className="text-[11px] font-black text-rose-400 uppercase tracking-widest">Override Impossible ✗</span>
                    </div>
                 </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col items-center justify-center">
           <div className="max-w-2xl w-full">
              {/* Progress Nodes */}
              <div className="flex items-center gap-0 mb-12 px-12">
                {QUESTIONS.map((_, i) => {
                   const isDone = i < currentQ;
                   const isCurrent = i === currentQ;
                   const isLast = i === QUESTIONS.length - 1;
                   return (
                     <div key={i} className={`flex-1 flex items-center ${isLast ? 'flex-none' : ''}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500 border-2 z-10 ${
                          isDone ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' : isCurrent ? 'bg-white border-primary text-primary shadow-lg shadow-primary/20' : 'bg-slate-800 border-slate-700 text-slate-500'
                        }`}>
                          {isDone ? <MdCheckCircle size={16} /> : i + 1}
                        </div>
                        {!isLast && (
                           <div className="flex-1 h-1 mx-[-2px] relative">
                             <div className="absolute inset-0 bg-slate-800 rounded-full" />
                             {isDone && <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-0 origin-left bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                           </div>
                        )}
                     </div>
                   )
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentQ} initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30, scale: 0.98 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-slate-900/40 backdrop-blur-xl rounded-[40px] p-6 md:p-10 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.3)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-mono font-black tracking-widest uppercase border ${
                        QUESTIONS[currentQ].isFinal ? 'bg-amber-950/40 text-amber-500 border-amber-500/30' : 'bg-primary/20 text-primary border-primary/30'
                      }`}>
                        {QUESTIONS[currentQ].isFinal ? <><MdOutlineScale size={14} /> Settlement Phase</> : <><MdFactCheck size={14} /> Analysis Point 0{currentQ + 1}</>}
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-heading font-black text-white tracking-tighter leading-none mb-8 max-w-2xl">
                      {QUESTIONS[currentQ].question}
                    </h2>

                    <div className={`grid gap-4 ${QUESTIONS[currentQ].isFinal ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {QUESTIONS[currentQ].options.map((opt, i) => {
                        const isSelected = selectedIdx === i;
                        const isCorrectOpt = i === QUESTIONS[currentQ].correct;
                        const showCorrect = feedback && isCorrectOpt;
                        const showWrong = feedback === 'wrong' && isSelected && !isCorrectOpt;
                        
                        return (
                          <motion.button
                            key={i}
                            whileHover={!feedback ? { scale: 1.02, x: QUESTIONS[currentQ].isFinal ? 0 : 8 } : {}}
                            whileTap={!feedback ? { scale: 0.98 } : {}}
                            onClick={() => handleAnswer(i)}
                            disabled={feedback !== null}
                            className={`w-full flex items-center justify-between text-left px-8 py-5 rounded-3xl font-mono text-sm transition-all border-2 relative overflow-hidden ${
                              showCorrect
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                                : showWrong
                                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
                                  : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-4 relative z-10">
                              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                                showCorrect ? 'bg-emerald-500 text-white' : showWrong ? 'bg-rose-500 text-white' : 'bg-white/10 text-white'
                              }`}>
                                {showCorrect ? <MdCheckCircle size={20} /> : showWrong ? <MdCancel size={20} /> : String.fromCharCode(65 + i)}
                              </span>
                              <span className={`font-bold ${showCorrect ? 'text-emerald-400' : showWrong ? 'text-rose-400' : ''}`}>{opt}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
           </div>
        </div>

        {/* Hint Area */}
        <AnimatePresence>
          {showHint && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto mt-12 p-6 bg-amber-500/10 border-2 border-amber-900/30 rounded-[32px] text-amber-500 text-[11px] font-mono flex items-center gap-4">
              <BsFillExclamationCircleFill size={20} className="flex-shrink-0" />
              <div>
                <span className="font-black uppercase tracking-widest text-[9px] block mb-0.5">Analytic Hint</span>
                <span className="font-bold opacity-90">{showHint}</span>
              </div>
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
