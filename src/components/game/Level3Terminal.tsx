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
  MdTerminal, 
  MdCheckCircle, 
  MdCancel, 
  MdOutlineSecurity, 
  MdDns, 
  MdOutlineMonitor, 
  MdOutlineFileCopy, 
  MdOutlineScale, 
  MdOutlineLightbulb, 
  MdNavigateNext,
  MdFactCheck 
} from 'react-icons/md';
import { 
  BsFileMedicalFill, 
  BsShieldLockFill, 
  BsFillExclamationCircleFill, 
  BsCpuFill, 
  BsDatabaseFillCheck 
} from 'react-icons/bs';

interface Props { onComplete: (result: LevelResult) => void; }

const TABS: Record<string, { label: string; icon: React.ReactNode; content: string[] }> = {
  MHI: { label: 'MHI System', icon: <MdDns size={14} />, content: ['LCD applied: Yes', 'Denial Code: 17A', 'Modifier: LCD flagged'] },
  CAS: { label: 'CAS Portal', icon: <MdOutlineSecurity size={14} />, content: ['Authorization search...', 'Result: Authorization FOUND', 'Auth ID: CAS-8812'] },
  CGX: { label: 'CGX 2.0', icon: <MdTerminal size={14} />, content: ['CGX Authorization lookup...', 'Auth present: Yes', 'DX on auth: C34.1 (Lung cancer)', 'DX match: YES'] },
  RFI: { label: 'RFI Center', icon: <MdOutlineFileCopy size={14} />, content: ['No additional RFI required', 'All documents on file'] },
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
  const [typedLines, setTypedLines] = useState<string[]>([]);
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
    onComplete({ level: 3, score: Math.max(0, fs + (elapsed < 60 ? 20 : 0)), time: elapsed, totalQuestions: QUESTIONS.length, correctAnswers: fc, hintsUsed });
  }, [timer, hintsUsed, onComplete]);

  useEffect(() => { if (timer.isExpired) finish(score, correctCount); }, [timer.isExpired]);

  const openTab = (key: string) => {
    setActiveTab(key);
    if (!visitedTabs.includes(key)) setVisitedTabs(v => [...v, key]);
    setTypedLines([]);
    TABS[key].content.forEach((line, i) => {
      setTimeout(() => setTypedLines(l => [...l, line]), (i + 1) * 300);
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

      <QuestionInstructionModal visible={showInstruction} type="tap-tabs" onDismiss={() => setShowInstruction(false)} autoDismissMs={5000} />
      <QuestionInstructionModal visible={showQInstruction} type="select-one" onDismiss={() => setShowQInstruction(false)} autoDismissMs={5000} />
      
      <GameHUD level={3} title="Authorization Override" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />

      <div className={`flex-1 p-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col`}>
        {/* Scenario Dossier */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 mb-8 border border-white/20 shadow-2xl relative overflow-hidden">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
               <div className="h-6 w-1/4 rounded bg-slate-100" />
               <div className="grid grid-cols-3 gap-6">
                 <div className="h-4 w-full rounded bg-slate-50" />
                 <div className="h-4 w-full rounded bg-slate-50" />
                 <div className="h-4 w-full rounded bg-slate-50" />
               </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <BsFileMedicalFill size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] font-mono font-black text-primary uppercase tracking-widest leading-none mb-1">Authorization Review</h3>
                  <span className="text-sm font-heading font-black text-slate-900 tracking-tight leading-none uppercase">Investigation Case #CR-2024-003</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-1">
                   <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Patient & Procedure</span>
                   <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                     <span className="text-xs font-mono font-bold text-slate-600 capitalize">DAVID K. • CT SCAN</span>
                     <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[9px] uppercase">Active</span>
                   </div>
                </div>

                <div className="flex flex-col gap-1">
                   <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Medical Metadata</span>
                   <div className="flex gap-2">
                     <span className="px-3 py-1.5 rounded-2xl bg-blue-50 text-blue-600 border-2 border-blue-100 font-mono font-black text-[13px] tracking-tighter">C34.1 DX</span>
                     <span className="px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-600 border-2 border-amber-100 font-mono font-black text-[13px] tracking-tighter">17A Code</span>
                     <span className="px-3 py-1.5 rounded-2xl bg-primary/10 text-primary border-2 border-primary/20 font-mono font-black text-[13px] tracking-tighter">LCD Applied</span>
                   </div>
                </div>

                <div className="flex flex-col gap-1">
                   <span className="text-[9px] font-mono font-black text-emerald-600 uppercase tracking-widest mb-1">External Authorization Link</span>
                   <div className="flex justify-between items-center bg-slate-900 p-3 rounded-2xl border-2 border-slate-800 shadow-xl shadow-emerald-500/5">
                     <span className="text-[11px] font-mono font-black text-white tracking-tighter flex items-center gap-1.5 uppercase">
                       <BsDatabaseFillCheck className="text-emerald-400 animate-pulse" /> FOUND IN CGX 2.0
                     </span>
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                   </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {phase === 'explore' ? (
          <div className="flex-1 flex flex-col">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/60 font-mono text-[9px] mb-2">
                  <BsCpuFill size={10} className="text-primary animate-spin-slow" /> MULTI-SYSTEM TERMINAL ACCESS
                </div>
                <h2 className="text-xl font-heading font-black text-white tracking-tight uppercase">System Intelligence Gathering</h2>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="flex gap-1.5">
                   {Object.keys(TABS).map(key => (
                     <div key={key} className={`w-2 h-2 rounded-full transition-all duration-500 ${visitedTabs.includes(key) ? 'bg-primary shadow-[0_0_8px_rgba(37,99,235,1)]' : 'bg-slate-700'}`} />
                   ))}
                 </div>
                 <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{visitedTabs.length}/4 SYSTEMS SAMPLED</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col max-h-[500px]">
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-0 overflow-x-auto no-scrollbar">
                {Object.keys(TABS).map(key => {
                   const isActive = activeTab === key;
                   const isVisited = visitedTabs.includes(key);
                   return (
                    <button key={key} onClick={() => openTab(key)}
                      className={`px-8 py-4 rounded-t-3xl font-mono text-[11px] font-black transition-all border-t-2 border-x-2 flex items-center gap-3 whitespace-nowrap tracking-widest uppercase ${
                        isActive
                          ? 'bg-slate-900 border-primary text-primary'
                          : isVisited
                            ? 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                            : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                      }`}>
                      <span className={`${isActive ? 'text-primary' : 'text-slate-600'}`}>{TABS[key].icon}</span>
                      {TABS[key].label}
                      {isVisited && !isActive && <MdCheckCircle size={14} className="text-emerald-500 ml-1" />}
                    </button>
                   );
                })}
              </div>

              {/* Terminal Window */}
              <div className="flex-1 bg-slate-900 shadow-2xl rounded-b-[40px] rounded-tr-[40px] p-8 border-x-2 border-b-2 border-slate-800 relative overflow-hidden group">
                {/* CRT Screen Effect */}
                {/* Scanlines Removed */}
                
                <div className="relative z-10 font-mono text-[13px] leading-relaxed">
                  {!activeTab ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                      <MdOutlineMonitor size={64} className="opacity-10 animate-pulse text-white" />
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="uppercase tracking-[0.3em] font-black italic">AWAITING CONNECTION...</span>
                      </div>
                      <p className="text-[10px] opacity-40">Select a secure terminal frequency above to begin data extraction.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                           <span className="text-primary font-black uppercase text-[10px] tracking-widest">Connection: Secure</span>
                           <span className="text-slate-600 font-black text-[10px]">#882-SYS-AUTH</span>
                        </div>
                        <span className="text-[10px] font-black text-rose-500/50 animate-pulse uppercase tracking-widest">Live Uplink</span>
                      </div>

                      <div className="space-y-3 pt-2">
                        <p className="text-primary font-bold">{`> initializing authentication protocol for ${TABS[activeTab].label}...`}</p>
                        <p className="text-emerald-500 font-bold italic tracking-tighter">» Connection established via secure node. [SUCCESS]</p>
                        
                        <div className="pl-4 space-y-2 border-l border-white/5 mt-6">
                          {typedLines.map((line, i) => (
                            <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                              className={`${line.includes('YES') || line.includes('Yes') || line.includes('FOUND') ? 'text-emerald-400 font-black' : 'text-slate-300'}`}>
                              {`  • ${line}`}
                            </motion.p>
                          ))}
                          <span className="inline-block w-2.5 h-5 bg-primary animate-[pulse_0.8s_infinite] align-middle ml-2" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end">
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => { setPhase('questions'); setShowQInstruction(true); }}
                className="group flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-[24px] font-mono text-[13px] font-black shadow-2xl shadow-primary/30 transition-all uppercase tracking-widest"
              >
                Engage Analytical Mode <MdNavigateNext size={24} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
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
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full blur-3xl text-foreground" />
                  
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto mt-12 p-6 bg-amber-500/10 border-2 border-amber-900/30 rounded-[32px] text-amber-500 text-[11px] font-mono flex items-center gap-4">
              <BsFillExclamationCircleFill size={20} className="flex-shrink-0" />
              <div>
                <span className="font-black uppercase tracking-widest text-[9px] block mb-0.5">Tactical Hint</span>
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
