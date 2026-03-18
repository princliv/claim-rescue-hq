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
  MdSearch, 
  MdArchive, 
  MdDeleteOutline, 
  MdCheckCircle, 
  MdLockOutline, 
  MdTag, 
  MdOutlineMedicalServices, 
  MdOutlineCalendarToday, 
  MdOutlineScale, 
  MdOutlineLightbulb, 
  MdFactCheck 
} from 'react-icons/md';
import { 
  BsFileMedicalFill, 
  BsShieldLockFill, 
  BsFillExclamationCircleFill, 
  BsGrid3X3GapFill 
} from 'react-icons/bs';

interface Props { onComplete: (result: LevelResult) => void; }

interface ClueCard { id: string; text: string; target: 'findings' | 'evidence' | 'discard'; icon: React.ReactNode; explanation: string; }

const CLUE_CARDS: ClueCard[] = [
  { id: 'c1', text: 'Denial code starts with 15', target: 'findings', icon: <MdTag size={14} />, explanation: 'Denial prefix "15" indicates an NCD-related denial — this is a key finding for your investigation.' },
  { id: 'c2', text: 'NCD ID has NA prefix', target: 'findings', icon: <MdFactCheck size={14} />, explanation: 'The "NA" prefix in the NCD ID confirms this is a National Coverage Determination case.' },
  { id: 'c3', text: 'No Authorization in CAS', target: 'evidence', icon: <MdLockOutline size={14} />, explanation: 'No authorization in the CAS system is critical evidence — without auth, you cannot override NCD denials.' },
  { id: 'c4', text: 'DX R51 is general headache', target: 'findings', icon: <MdOutlineMedicalServices size={14} />, explanation: 'R51 is a general/unspecified headache code — a key finding that shows the DX may not meet NCD requirements.' },
  { id: 'c5', text: 'Billing date is correct', target: 'discard', icon: <MdOutlineCalendarToday size={14} />, explanation: 'Billing date being correct is routine — it doesn\'t help prove or disprove the NCD denial.' },
];

const DECISION_EXPLANATION = 'No authorization exists and the DX is a general headache code that doesn\'t meet NCD criteria. The denial must be upheld.';
const HINTS = ["Look for 'NA' in the NCD ID field", 'No auth = no override possible'];

const FEEDBACK_DELAY = 2500;

export default function Level2DragDrop({ onComplete }: Props) {
  const [pool, setPool] = useState(CLUE_CARDS.map(c => c.id).sort(() => Math.random() - 0.5));
  const [findings, setFindings] = useState<string[]>([]);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [discarded, setDiscarded] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<'sort' | 'decision'>('sort');
  const [lastFeedback, setLastFeedback] = useState<{ correct: boolean; cardId: string } | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
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
    else { setScore(s => s - 5); }
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
    { key: 'findings' as const, label: 'FINDINGS', icon: MdSearch, items: findings, color: 'text-primary', borderColor: 'border-primary/30', bg: 'bg-primary/5' },
    { key: 'evidence' as const, label: 'EVIDENCE', icon: MdArchive, items: evidence, color: 'text-emerald-600', borderColor: 'border-emerald-200', bg: 'bg-emerald-50' },
    { key: 'discard' as const, label: 'DISCARD', icon: MdDeleteOutline, items: discarded, color: 'text-rose-600', borderColor: 'border-rose-200', bg: 'bg-rose-50' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f18] relative overflow-hidden">
      {/* Immersive Medical Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40 mix-blend-screen scale-110 blur-[1px]"
        style={{ backgroundImage: `url(${section2Bg})` }}
      />
      <div className="absolute inset-0 bg-[#0a0f18] z-0" />

      <QuestionInstructionModal
        visible={showInstruction}
        type="drag-right"
        onDismiss={() => setShowInstruction(false)}
        autoDismissMs={5000}
      />
      
      <GameHUD level={2} title="NCD Case Investigation" score={score} timeLeft={timer.timeLeft} hintsLeft={2 - hintsUsed} onHint={handleHint} />

      <div className={`flex-1 p-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col`}>
        {/* Dossier Header - High Fidelity */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 mb-8 border border-white/20 shadow-2xl relative overflow-hidden"
        >
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
                  <h3 className="text-[10px] font-mono font-black text-primary uppercase tracking-widest leading-none mb-1">Dossier Information</h3>
                  <span className="text-sm font-heading font-black text-slate-900 tracking-tight leading-none uppercase">Investigation Case #CR-2024-002</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-1">
                   <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Diagnostic Context</span>
                   <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                     <span className="text-xs font-mono font-bold text-slate-600 capitalize">MARIA S. • MRI BRAIN</span>
                     <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[9px] uppercase">Validated</span>
                   </div>
                </div>

                <div className="flex flex-col gap-1">
                   <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Code Metrics (NCD/DX)</span>
                   <div className="flex gap-2">
                     <span className="px-3 py-1.5 rounded-2xl bg-blue-50 text-blue-600 border-2 border-blue-100 font-mono font-black text-[13px] tracking-tighter">R51</span>
                     <span className="px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-600 border-2 border-amber-100 font-mono font-black text-[13px] tracking-tighter">15B Denial</span>
                     <span className="px-3 py-1.5 rounded-2xl bg-primary/10 text-primary border-2 border-primary/20 font-mono font-black text-[13px] tracking-tighter">NA-123</span>
                   </div>
                </div>

                <div className="flex flex-col gap-1">
                   <span className="text-[9px] font-mono font-black text-rose-400 uppercase tracking-widest mb-1">Access Status</span>
                   <div className="flex justify-between items-center bg-slate-900 p-3 rounded-2xl border-2 border-slate-800">
                     <span className="text-[11px] font-mono font-black text-white tracking-tighter flex items-center gap-1.5 uppercase">
                       <BsShieldLockFill className="text-rose-400" /> NO AUTH FOUND
                     </span>
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                   </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {phase === 'sort' ? (
          <div className="flex-1 flex flex-col">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/60 font-mono text-[9px] mb-4">
                <BsGrid3X3GapFill size={10} /> INITIAL SORTING PHASE
              </div>
              <h2 className="text-xl font-heading font-black text-white tracking-tight uppercase">Analyze & Categorize Evidence</h2>
            </div>

            {/* Pool of Cards */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <AnimatePresence>
                {pool.map(id => {
                  const card = CLUE_CARDS.find(c => c.id === id)!;
                  const isSelected = selectedCard === id;
                  return (
                    <motion.button
                      key={id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                      whileHover={{ y: -5, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCard(isSelected ? null : id)}
                      className={`px-6 py-4 rounded-[20px] font-mono text-xs transition-all flex items-center gap-3 border-2 ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-primary ${isSelected ? 'bg-primary text-white' : 'bg-white/5'}`}>{card.icon}</span>
                      <span className="font-bold tracking-tight">{card.text}</span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Premium Drop Zones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 max-h-[300px]">
              {zones.map(zone => (
                <motion.button
                  key={zone.key}
                  whileHover={selectedCard ? { scale: 1.02, y: -5 } : {}}
                  onClick={() => handleDrop(zone.key)}
                  className={`border-2 border-dashed rounded-[32px] p-8 transition-all text-left flex flex-col relative overflow-hidden min-h-[220px] ${
                    selectedCard
                      ? `${zone.borderColor} ${zone.bg} cursor-pointer shadow-lg`
                      : 'border-white/5 bg-transparent cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-sm font-black`}>
                       <zone.icon size={20} className={zone.color} />
                    </div>
                    <div>
                      <p className={`text-[10px] font-mono uppercase tracking-widest font-black ${zone.color}`}>{zone.label}</p>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">{zone.items.length} LOGGED</span>
                    </div>
                  </div>

                  <div className="space-y-2 relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {zone.items.map(id => {
                      const card = CLUE_CARDS.find(c => c.id === id);
                      return (
                        <motion.div
                          key={id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`text-[11px] font-mono font-bold rounded-xl px-4 py-2.5 border-2 shadow-sm ${
                            zone.key === 'findings' ? 'bg-primary text-white border-primary/20'
                            : zone.key === 'evidence' ? 'bg-emerald-500 text-white border-emerald-400/20'
                            : 'bg-rose-500 text-white border-rose-400/20'
                          }`}
                        >
                          <div className="flex gap-3 items-center">
                            <span className="opacity-80 flex-shrink-0">{card?.icon}</span>
                            <span className="tracking-tight">{card?.text}</span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Empty state decoration */}
                  {zone.items.length === 0 && !selectedCard && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                       <zone.icon size={80} className="text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* Final Decision Phase */
          <div className="flex-1 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              className="max-w-xl w-full bg-slate-900/60 backdrop-blur-2xl rounded-[48px] p-12 text-center border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[10px] font-mono font-black tracking-widest uppercase mb-8 mx-auto w-fit">
                <MdOutlineScale size={16} /> FINAL RULING REQUIRED
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tighter leading-none mb-10 max-w-2xl">Complete Your Investigation</h2>
              <p className="text-slate-400 text-sm font-mono mb-12 capitalize leading-relaxed px-4">
                Synthesize all evidence gathered from the NCD case file and provide your final policy judgment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {['Override Denial', 'Uphold Denial'].map((opt, i) => (
                  <motion.button 
                    key={opt} 
                    whileHover={{ y: -5, scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={() => handleDecision(i === 0)}
                    className={`flex-1 px-8 py-5 rounded-[24px] font-mono text-[13px] font-black transition-all border-2 ${
                      i === 0 
                        ? 'bg-transparent border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20' 
                        : 'bg-primary border-primary text-white shadow-xl shadow-primary/20'
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Hint Area */}
        <div className="mt-12 h-12 flex items-center justify-center">
          <AnimatePresence>
            {showHint && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }} 
                className="bg-amber-500/10 border-2 border-amber-900/30 rounded-2xl px-6 py-3 text-amber-500 text-[11px] font-mono flex items-center gap-3"
              >
                <BsFillExclamationCircleFill size={16} className="flex-shrink-0" />
                <span className="font-bold tracking-tight">{showHint}</span>
              </motion.div>
            )}
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
