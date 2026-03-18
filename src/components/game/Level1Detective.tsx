import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHUD from './GameHUD';
import InstructorFeedback from './InstructorFeedback';
import QuestionInstructionModal from './QuestionInstructionModal';
import { useLevelTimer } from '@/hooks/useLevelTimer';
import { LevelResult } from '@/types/game';
import section2Bg from '@/assets/bg_section2.png';

// React Icons Imports
import { 
  MdCheckCircle, 
  MdCancel, 
  MdOutlineFileCopy, 
  MdOutlineScale, 
  MdOutlineLightbulb, 
  MdFactCheck, 
  MdOutlineSecurity 
} from 'react-icons/md';
import { 
  BsFileMedicalFill, 
  BsShieldLockFill, 
  BsFillExclamationCircleFill 
} from 'react-icons/bs';

interface Props { onComplete: (result: LevelResult) => void; }

const QUESTIONS = [
  { question: 'What should you check first?', options: ['Check Authorization', 'Check MHI Screen', 'Release Payment'], correct: 1, isFinal: false,
    explanation: 'Always check the MHI Screen first — it shows the denial reason, LCD/NCD flags, and applied rules before you investigate further.' },
  { question: 'What does denial code 04@ indicate?', options: ['Payment Processed', 'LCD/NCD Denial', 'Duplicate Claim'], correct: 1, isFinal: false,
    explanation: 'Denial code 04@ is an LCD/NCD denial indicator. The "04" prefix and "@" suffix flag a Local Coverage Determination issue.' },
  { question: 'Is authorization available?', options: ['Yes', 'No'], correct: 1, isFinal: false,
    explanation: 'The claim file clearly shows Authorization: Not found. Without authorization, LCD denials cannot be overridden.' },
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
    else { setFeedback('wrong'); }

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
    <div className="min-h-screen flex flex-col bg-[#0a0f18] relative overflow-hidden">
      {/* Background with cinematic medical image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40 mix-blend-screen scale-110 blur-[2px]"
        style={{ backgroundImage: `url(${section2Bg})` }}
      />
      <div className="absolute inset-0 bg-[#0a0f18] z-0" />

      <QuestionInstructionModal
        visible={showInstruction}
        type="select-one"
        onDismiss={() => setShowInstruction(false)}
        autoDismissMs={5000}
      />
      
      <GameHUD level={1} title="Basic LCD Denial" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />
      
      <div className={`flex-1 flex items-center justify-center p-6 relative z-10 w-full max-w-7xl mx-auto`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          {/* Claim File - Medical Document Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 border border-white/20 shadow-2xl relative overflow-hidden flex flex-col h-full"
            >
              {isLoading ? (
                <div className="space-y-6 animate-pulse">
                   <div className="h-6 w-3/4 rounded bg-slate-100" />
                   <div className="space-y-4 pt-4">
                     {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-4 w-full rounded bg-slate-50" />)}
                   </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <BsFileMedicalFill size={20} />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-mono font-black text-primary uppercase tracking-widest leading-none mb-1">Dossier Access</h3>
                      <span className="text-sm font-heading font-black text-slate-900 tracking-tight leading-none uppercase">Case #CR-2024-001</span>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block mb-2">Patient Records</span>
                      <div className="flex justify-between items-center px-1">
                         <span className="text-xs font-mono font-bold text-slate-600">ID: John D.</span>
                         <span className="text-[10px] font-mono text-slate-400">DOB: 05/12/82</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1 px-1">
                         <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest uppercase mb-1">Procedure Index</span>
                         <div className="flex justify-between items-center text-xs font-mono font-bold">
                           <span className="text-slate-600">CHEST X-RAY</span>
                           <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">71045</span>
                         </div>
                      </div>

                      <div className="flex flex-col gap-1 px-1">
                         <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Diagnosis Matrix</span>
                         <div className="flex justify-between items-center">
                           <span className="px-3 py-1.5 rounded-2xl bg-blue-50 text-blue-600 border-2 border-blue-100 font-mono font-black text-[13px] tracking-tighter">Z00.00</span>
                           <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">General Exam</span>
                         </div>
                      </div>

                      <div className="flex flex-col gap-1 px-1">
                         <span className="text-[9px] font-mono font-black text-rose-400 uppercase tracking-widest mb-1">Denial Code (FLG)</span>
                         <div className="flex justify-between items-center">
                           <span className="px-3 py-1.5 rounded-2xl bg-rose-50 text-rose-600 border-2 border-rose-100 font-mono font-black text-[13px] tracking-tighter animate-pulse">04@</span>
                           <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-tighter">LCD Flags Detected</span>
                         </div>
                      </div>

                      <div className="flex flex-col gap-1 px-1">
                         <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Authorization Link</span>
                         <div className="flex justify-between items-center">
                           <span className="px-3 py-1.5 rounded-2xl bg-slate-900 text-white border-2 border-slate-800 font-mono font-black text-[11px] tracking-tighter flex items-center gap-1.5">
                             <BsShieldLockFill className="text-rose-400" /> NOT FOUND
                           </span>
                           <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">System Lock</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2">
                    <MdCheckCircle className="text-primary" />
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest leading-none">Security Verified</span>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Analytical Phase - Question Area */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="max-w-3xl w-full mx-auto">
              {/* Progress Tracker Node-based */}
              <div className="flex items-center gap-0 mb-12 px-12 order-1 lg:order-none">
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

              {/* Question Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.98 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-slate-900/40 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.3)] relative overflow-hidden"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-tr-full blur-2xl" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-mono font-black tracking-widest uppercase border ${
                        q.isFinal ? 'bg-amber-950/40 text-amber-500 border-amber-500/30' : 'bg-primary/20 text-primary border-primary/30'
                      }`}>
                        {q.isFinal ? <><MdOutlineScale size={14} /> Final Settlement Phase</> : <><MdFactCheck size={14} /> Analysis Point 0{currentQ + 1}</>}
                      </div>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tighter leading-none mb-10 max-w-2xl">
                      {q.question}
                    </h2>

                    <div className={`grid gap-4 ${q.isFinal ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {q.options.map((opt, i) => {
                        const isSelected = selectedIdx === i;
                        const isCorrectOpt = i === q.correct;
                        const showCorrect = feedback && isCorrectOpt;
                        const showWrong = feedback === 'wrong' && isSelected && !isCorrectOpt;
                        
                        return (
                          <motion.button
                            key={i}
                            whileHover={!feedback ? { scale: 1.02, x: q.isFinal ? 0 : 8 } : {}}
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
                            
                            {/* Scanning effect on hover */}
                            {!feedback && (
                              <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-full group-hover:translate-x-0" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    <AnimatePresence>
                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="mt-8 p-6 bg-amber-500/10 border-2 border-amber-900/30 rounded-3xl text-amber-500 text-[11px] font-mono flex items-start gap-4"
                        >
                          <BsFillExclamationCircleFill size={18} className="flex-shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-black uppercase tracking-widest text-[9px] block">Decryption Hint</span>
                            <span className="opacity-90 leading-relaxed font-bold">{showHint}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
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
