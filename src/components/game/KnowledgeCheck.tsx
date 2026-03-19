import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdFactCheck, MdCheckCircle, MdCancel, MdArrowForward } from 'react-icons/md';
import { KnowledgeQuestion } from '@/types/game';

interface Props {
  questions: KnowledgeQuestion[];
  onComplete: (correctAnswers: number) => void;
}

export default function KnowledgeCheck({ questions, onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (idx: number) => {
    if (showFeedback) return;
    setSelectedIdx(idx);
    const isCorrect = idx === questions[currentQ].correct;
    if (isCorrect) setCorrectCount(c => c + 1);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedIdx(null);
      setShowFeedback(false);
    } else {
      onComplete(correctCount);
    }
  };

  const q = questions[currentQ];

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8 px-2">
         <div className="flex items-center gap-2">
           <MdFactCheck className="text-primary" size={20} />
           <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">Knowledge Check 0{currentQ + 1}</h3>
         </div>
         <div className="flex gap-1.5">
           {questions.map((_, i) => (
             <div key={i} className={`h-1 w-8 rounded-full transition-all ${i <= currentQ ? 'bg-primary' : 'bg-slate-200'}`} />
           ))}
         </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full blur-2xl" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-heading font-black text-white tracking-tight leading-tight mb-8">
              {q.question}
            </h2>

            <div className="space-y-4">
              {q.options.map((opt, i) => {
                const isSelected = selectedIdx === i;
                const isCorrect = i === q.correct;
                const showStatus = showFeedback && (isSelected || isCorrect);
                
                return (
                  <motion.button
                    key={i}
                    whileHover={!showFeedback ? { x: 8, scale: 1.01 } : {}}
                    whileTap={!showFeedback ? { scale: 0.99 } : {}}
                    onClick={() => handleAnswer(i)}
                    disabled={showFeedback}
                    className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-300 text-left ${
                      showStatus
                        ? isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-xl shadow-emerald-500/10'
                          : 'bg-rose-500/10 border-rose-500 text-rose-400'
                        : 'bg-slate-900/40 border-white/5 hover:border-blue-500/30 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                        showStatus ? 'bg-slate-800 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-bold">{opt}</span>
                    </div>
                    {showStatus && (
                      <div className="flex-shrink-0">
                        {isCorrect ? <MdCheckCircle size={24} className="text-emerald-500" /> : isSelected && <MdCancel size={24} className="text-rose-500" />}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextQuestion}
                      className="w-full flex items-center justify-center gap-2 p-6 bg-primary text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/30"
                    >
                      {currentQ < questions.length - 1 ? 'Next Criterion' : 'Complete Knowledge Check'}
                      <MdArrowForward size={20} />
                    </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
