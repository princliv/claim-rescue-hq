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
  MdCompare, 
  MdCheckCircle, 
  MdCancel, 
  MdOutlineScale, 
  MdFactCheck, 
  MdOutlineWarningAmber, 
  MdSearch, 
  MdOutlineFolderShared, 
  MdOutlineSecurity, 
  MdNavigateNext 
} from 'react-icons/md';
import { 
  BsFileMedicalFill, 
  BsShieldLockFill, 
  BsFillExclamationCircleFill, 
  BsArrowLeftRight, 
  BsLightningFill 
} from 'react-icons/bs';

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
    <div className="min-h-screen flex flex-col bg-[#0a0f18] relative overflow-hidden">
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40 mix-blend-screen scale-110 blur-[1px]"
        style={{ backgroundImage: `url(${section2Bg})` }}
      />
      <div className="absolute inset-0 bg-[#0a0f18] z-0" />

      <QuestionInstructionModal visible={showInstruction} type="compare-select" onDismiss={() => setShowInstruction(false)} autoDismissMs={5000} />
      <QuestionInstructionModal visible={showQInstruction} type="select-one" onDismiss={() => setShowQInstruction(false)} autoDismissMs={5000} />
      
      <GameHUD level={4} title="DX Mismatch Puzzle" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />

      <div className={`flex-1 p-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col`}>
        
        <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/60 font-mono text-[9px] mb-4">
              <BsArrowLeftRight size={10} className="animate-pulse" /> CROSS-DOCUMENT VALIDATION ENGINE
            </div>
            <h2 className="text-2xl font-heading font-black text-white tracking-tight uppercase">Analyze Claim vs Authorization</h2>
        </div>

        {/* Comparison Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-10 w-full">
          {/* Claim Column */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-10 border border-white/20 shadow-2xl relative overflow-hidden">
            {isLoading ? (
               <div className="space-y-6 animate-pulse">
                  <div className="h-6 w-1/2 rounded bg-slate-100" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-4 w-full rounded bg-slate-50" />)}
                  </div>
               </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <MdOutlineFolderShared size={20} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-mono font-black text-primary uppercase tracking-widest leading-none mb-1">Source Dossier</h3>
                    <span className="text-sm font-heading font-black text-slate-900 tracking-tight leading-none uppercase">Claim Rec #CR-2024-004</span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block mb-2">Patient Registry</span>
                    <span className="text-xs font-mono font-black text-slate-700">LISA R. • DOB: 09/24/75</span>
                  </div>

                  <div className="flex flex-col gap-1 px-1">
                     <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Rendered Procedure</span>
                     <div className="flex justify-between items-center text-xs font-mono font-black uppercase text-slate-600">
                       <span>ULTRASOUND SCAN</span>
                       <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[9px]">Validated</span>
                     </div>
                  </div>

                  <motion.div
                    animate={compared ? { scale: 1.05, borderColor: 'rgba(244,63,94,0.4)', backgroundColor: 'rgba(244,63,94,0.02)' } : {}}
                    className="flex flex-col gap-1 p-3 rounded-2xl border-2 border-transparent transition-all"
                  >
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Claim Diagnosis (DX)</span>
                    <div className="flex justify-between items-center">
                      <span className={`px-4 py-2 rounded-2xl font-mono font-black text-[15px] tracking-tighter border-2 ${compared ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-primary/5 text-primary border-primary/20'}`}>K21.9</span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">GI Disorder (GERD)</span>
                    </div>
                  </motion.div>

                  <div className="flex flex-col gap-1 px-1">
                     <span className="text-[9px] font-mono font-black text-amber-500 uppercase tracking-widest mb-1">Denial Flag</span>
                     <div className="flex justify-between items-center">
                       <span className="px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-600 border-2 border-amber-100 font-mono font-black text-[13px] tracking-tighter">17B Denial</span>
                       <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Review Pending</span>
                     </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Authorization Column */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-10 border border-white/20 shadow-2xl relative overflow-hidden">
            {isLoading ? (
               <div className="space-y-6 animate-pulse">
                  <div className="h-6 w-1/2 rounded bg-slate-100" />
                   <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-4 w-full rounded bg-slate-50" />)}
                  </div>
               </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <MdOutlineSecurity size={20} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-mono font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">System Authorization</h3>
                    <span className="text-sm font-heading font-black text-slate-900 tracking-tight leading-none uppercase">Auth ID #AS-9921-X</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col gap-1 px-1">
                     <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Auth Status</span>
                     <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border-2 border-slate-800">
                       <span className="text-[11px] font-mono font-black text-white tracking-tighter flex items-center gap-2 uppercase">
                         <BsShieldLockFill className="text-emerald-400" /> AUTH DETECTED
                       </span>
                       <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-1 px-1">
                     <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Authorized Procedure</span>
                     <div className="flex justify-between items-center text-xs font-mono font-black uppercase text-slate-600 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                       <span>ULTRASOUND SCAN</span>
                       <span className="text-[10px] text-slate-400">#76700</span>
                     </div>
                  </div>

                  <motion.div
                    animate={compared ? { scale: 1.05, borderColor: 'rgba(244,63,94,0.4)', backgroundColor: 'rgba(244,63,94,0.02)' } : {}}
                    className="flex flex-col gap-1 p-3 rounded-2xl border-2 border-transparent transition-all"
                  >
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Authorized Diagnosis (DX)</span>
                    <div className="flex justify-between items-center">
                      <span className={`px-4 py-2 rounded-2xl font-mono font-black text-[15px] tracking-tighter border-2 ${compared ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-primary/5 text-primary border-primary/20'}`}>N20.0</span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Renal Stone</span>
                    </div>
                  </motion.div>
                </div>

                <div className="absolute -bottom-4 -right-4 text-[40px] text-slate-100 font-black rotate-[-15deg] pointer-events-none select-none select-none opacity-50 uppercase tracking-widest">
                   VALID
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Mismatch Alert Overlay */}
        <div className="h-16 mb-8 flex items-center justify-center">
          <AnimatePresence>
            {compared && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex items-center gap-4 px-8 py-4 bg-rose-500/10 border-2 border-rose-500/40 rounded-3xl shadow-2xl shadow-rose-900/20"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/40">
                  <MdOutlineWarningAmber size={24} className="animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-[0.2em] leading-none mb-1">Anomaly Detected</span>
                  <span className="text-sm font-mono font-black text-rose-500 tracking-tighter uppercase leading-none">DX MISMATCH: CLAIM K21.9 ≠ AUTH N20.0</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {phase === 'compare' ? (
          <div className="text-center">
            {isLoading ? null : !compared ? (
              <motion.button 
                whileHover={{ y: -5, scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => setCompared(true)}
                className="relative group bg-white p-[3px] rounded-[28px] overflow-hidden shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-primary transition-all group-hover:scale-110" />
                <div className="relative bg-slate-900 px-12 py-5 rounded-[26px] flex items-center gap-3">
                  <MdSearch size={24} className="text-amber-400" />
                  <span className="text-white font-mono text-[13px] font-black uppercase tracking-widest">Execute Field Comparison</span>
                  <div className="absolute h-full w-full top-0 left-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {/* Sonar Effect */}
                <div className="absolute inset-0 rounded-[28px] border-2 border-amber-500 animate-[ping_2s_infinite] opacity-30 pointer-events-none" />
              </motion.button>
            ) : (
              <motion.button 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.05 }}
                onClick={() => { setPhase('questions'); setShowQInstruction(true); }}
                className="group flex items-center gap-3 px-12 py-5 bg-primary text-white rounded-[24px] font-mono text-[13px] font-black shadow-2xl shadow-primary/30 transition-all uppercase tracking-widest mx-auto"
              >
                Proceed to Intelligence Analysis <MdNavigateNext size={24} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        ) : (
          /* Question Phase */
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full">
               {/* Node-based Progress Tracker */}
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
                  className="bg-slate-900/40 backdrop-blur-xl rounded-[40px] p-10 md:p-14 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.3)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-mono font-black tracking-widest uppercase border ${
                        QUESTIONS[currentQ].isFinal ? 'bg-amber-950/40 text-amber-500 border-amber-500/30' : 'bg-primary/20 text-primary border-primary/30'
                      }`}>
                        {QUESTIONS[currentQ].isFinal ? <><MdOutlineScale size={14} /> Settlement Phase</> : <><MdFactCheck size={14} /> Analysis Point 0{currentQ + 1}</>}
                      </div>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tighter leading-none mb-10 max-w-2xl">
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
        )}

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
