import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDns, MdSettings, MdHistory, MdWarning, MdArrowForward } from 'react-icons/md';
import { InvestigationStep } from '@/types/game';

interface Props {
  steps: InvestigationStep[];
  onStepComplete: (stepId: string, isCorrectOrder: boolean) => void;
  onAllStepsComplete: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  mhi: <MdDns size={24} />,
  cfi: <MdSettings size={24} />,
  dates: <MdHistory size={24} />,
  exclusions: <MdWarning size={24} />,
};

export default function InvestigationStepper({ steps, onStepComplete, onAllStepsComplete }: Props) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const handleStepClick = (stepId: string, index: number) => {
    if (completedSteps.includes(stepId)) {
        setActiveStep(stepId);
        return;
    }

    const expectedStepId = steps[completedSteps.length]?.id;
    const isCorrectOrder = stepId === expectedStepId;

    if (isCorrectOrder) {
      const newCompleted = [...completedSteps, stepId];
      setCompletedSteps(newCompleted);
      setActiveStep(stepId);
      onStepComplete(stepId, true);
      if (newCompleted.length === steps.length) {
        onAllStepsComplete();
      }
    } else {
      onStepComplete(stepId, false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2 px-2">
         <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">Investigation Progress</h3>
         <span className="text-[10px] font-mono font-black text-primary uppercase">{completedSteps.length} / {steps.length} Complete</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = activeStep === step.id;
          const isLocked = !isCompleted && index > completedSteps.length;
          const isNext = index === completedSteps.length;

          return (
            <motion.button
              key={step.id}
              whileHover={!isLocked ? { y: -5, scale: 1.02 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              onClick={() => handleStepClick(step.id, index)}
              disabled={isLocked}
              className={`relative flex flex-col items-center p-6 rounded-[32px] border-2 transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/30' 
                  : isCompleted
                    ? 'bg-slate-900/60 backdrop-blur-md border-emerald-500/20 text-slate-400 hover:text-slate-200'
                    : isNext
                      ? 'bg-slate-900/40 backdrop-blur-md border-blue-500/20 border-dashed text-blue-400 hover:border-blue-400/40 animate-pulse-subtle'
                      : 'bg-slate-900/20 border-white/5 text-slate-500 grayscale opacity-50 cursor-not-allowed'
              }`}
            >
              <div className={`mb-3 p-3 rounded-2xl transition-colors ${isActive ? 'bg-white/20' : isCompleted ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100'}`}>
                {ICON_MAP[step.icon] || <MdSettings size={24} />}
              </div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest">{step.label}</span>
              
              {isCompleted && !isActive && (
                <div className="absolute top-2 right-2 text-emerald-500">
                  <MdArrowForward className="rotate-[-45deg]" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeStep && (
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-full font-mono text-[9px] font-black uppercase tracking-widest">
                  Extracted Data: {steps.find(s => s.id === activeStep)?.label}
                </span>
              </div>
              <p className="text-xl font-heading font-black text-white tracking-tight leading-relaxed">
                {steps.find(s => s.id === activeStep)?.data}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
