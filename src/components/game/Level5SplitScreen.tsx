import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHUD from './GameHUD';
import InvestigationStepper from './InvestigationStepper';
import KnowledgeCheck from './KnowledgeCheck';
import ScenarioCard from './ScenarioCard';
import DecisionSection from './DecisionSection';
import MentorHint from './MentorHint';
import ScorePanel from './ScorePanel';
import DetailedFeedbackModal from './DetailedFeedbackModal';
import BonusPopup from './BonusPopup';
import LevelGuideModal from './LevelGuideModal';
import { useTimer } from '@/hooks/useTimer';
import { LevelResult, InvestigationStep, LEVEL_TITLES } from '@/types/game';
import { QUESTIONS_DATA } from '@/data/questionsData';
import { getRuleExplanation } from '@/utils/decisionLogic';
import section1Bg from '@/assets/bg_section1.png';

// Icons
import { BsShieldLockFill, BsFillLightbulbFill, BsActivity } from 'react-icons/bs';
import { MdOutlineScale, MdFactCheck, MdHistoryEdu } from 'react-icons/md';

interface Props { onComplete: (result: LevelResult) => void; }

const STEPS: InvestigationStep[] = [
  { id: 'mhi', label: 'Check MHI Screen', icon: 'mhi', data: 'MHI Screen Analysis: SB=Y found. Facility is active for split billing audits.' },
  { id: 'cfi', label: 'Check CFI Screen', icon: 'cfi', data: 'CFI Screen Audit: SPLITBL=3 found. This signals the system to apply the 72-hour exclusion rule logic.' },
  { id: 'dates', label: 'Compare Dates', icon: 'dates', data: 'Timeline Check: Service date 01/08 is within 72 hours of admission 01/10. Window rule is met.' },
  { id: 'exclusions', label: 'Check Exclusions', icon: 'exclusions', data: 'Clinical Scan: HCPCS G0257 detected. This specific code is classified as a Clinical Exclusion, regardless of the 3-day window.' },
];

const HINTS = QUESTIONS_DATA.level5.hints;
const FINAL_DECISION = QUESTIONS_DATA.level5.finalDecision;

export default function Level5SplitScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'investigate' | 'quiz' | 'decision'>('investigate');
  const [stepScore, setStepScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [decisionScore, setDecisionScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusScore, setBonusScore] = useState(0);
  const [isCorrectDecision, setIsCorrectDecision] = useState(false);
  const [allStepsDone, setAllStepsDone] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const timer = useTimer(240);

  useEffect(() => { 
    window.scrollTo(0, 0);
    timer.start(); 
  }, []);

  const handleStepComplete = (stepId: string, isCorrectOrder: boolean) => {
    if (isCorrectOrder) setStepScore(s => s + 10);
    else setStepScore(s => s - 5);

    // Trigger bonus after second step
    if (stepId === 'cfi') {
      setTimeout(() => setShowBonus(true), 1000);
    }
  };

  const handleAllStepsComplete = () => {
    setAllStepsDone(true);
    setTimeout(() => {
        setPhase('quiz');
        const container = document.querySelector('.main-content-scroll');
        if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  const handleQuizComplete = (correctCount: number) => {
    setQuizScore(correctCount * 10);
    setPhase('decision');
    setTimeout(() => {
        const container = document.querySelector('.main-content-scroll');
        if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleDecision = (apply: boolean) => {
    timer.stop();
    const correctIdx = QUESTIONS_DATA.level5.finalDecision.correct;
    const isCorrect = (apply ? 0 : 1) === correctIdx;
    
    setIsCorrectDecision(isCorrect);
    setDecisionScore(isCorrect ? 50 : -30);
    setShowFeedback(true);
  };

  const finalizeResult = () => {
    const timeBonus = timer.calculateBonus();
    const total = stepScore + quizScore + decisionScore + timeBonus + bonusScore - (hintsUsed * 10);
    onComplete({
      level: 5,
      score: Math.max(0, total),
      time: timer.getElapsed(),
      totalQuestions: 2,
      correctAnswers: (quizScore / 10) + (isCorrectDecision ? 1 : 0),
      hintsUsed,
      stepScore,
      quizScore,
      decisionScore,
      timeBonus,
      bonusScore,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f18] relative overflow-hidden font-sans text-slate-100">
      <AnimatePresence>
        {showBonus && (
          <BonusPopup onComplete={(score) => {
            setBonusScore(score);
            setShowBonus(false);
          }} />
        )}
      </AnimatePresence>

      <LevelGuideModal 
        visible={showGuide} 
        onClose={() => { setShowGuide(false); window.scrollTo(0, 0); }} 
        level={5}
        title="Advanced Clinical Logic"
        interactionModel="DETECTIVE_INVESTIGATION"
        instructions={[
          "Compare the HCPCS code G0257 against the 3-day exclusionary rule.",
          "Check the SPLITBL=3 indicator for advanced inpatient logic.",
          "Validate the clinical necessity and service window alignment."
        ]}
      />

      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20 scale-110 blur-[2px]"
        style={{ backgroundImage: `url(${section1Bg})` }}
      />
      
      <GameHUD 
        level={5} 
        title={LEVEL_TITLES[5]} 
        score={stepScore + decisionScore + bonusScore - (hintsUsed * 10)} 
        timeLeft={timer.timeLeft} 
        hintsLeft={2 - hintsUsed} 
        onHint={() => setHintsUsed(prev => Math.min(prev + 1, 2))} 
      />

      <div className="flex-1 flex flex-col p-8 relative z-10 w-full max-w-7xl mx-auto main-content-scroll overflow-y-auto">
        
        {/* Advanced Logic Highlights */}
        <div className="flex flex-wrap gap-4 mb-4">
           {phase !== 'investigate' && (
             <>
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
                 className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                 <BsActivity className="text-emerald-400" />
                 <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">3-Day Rule Active</span>
               </motion.div>
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                 className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                 <MdHistoryEdu className="text-amber-400" />
                 <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest">Exclusion Overrides Rule</span>
               </motion.div>
             </>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <ScenarioCard scenario={QUESTIONS_DATA.level5.scenario} />

            <div className="space-y-4">
               <h4 className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-[0.3em] px-2 text-center">Step-by-Step Investigation</h4>
               <InvestigationStepper 
                 steps={STEPS} 
                 onStepComplete={handleStepComplete} 
                 onAllStepsComplete={handleAllStepsComplete} 
               />
            </div>

            {phase === 'quiz' && (
              <KnowledgeCheck 
                questions={QUESTIONS_DATA.level5.mcqs} 
                onComplete={handleQuizComplete} 
              />
            )}

            <DecisionSection 
                onDecision={handleDecision}
                options={QUESTIONS_DATA.level5.finalDecision.options}
                disabled={phase !== 'decision'}
                question={QUESTIONS_DATA.level5.finalDecision.question}
            />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <ScorePanel 
              stepScore={stepScore} 
              quizScore={quizScore} 
              decisionScore={decisionScore} 
              timeBonus={timer.isExpired ? 0 : timer.calculateBonus()} 
              totalScore={stepScore + quizScore + decisionScore + (timer.isExpired ? 0 : timer.calculateBonus()) + bonusScore - (hintsUsed * 10)} 
            />
            
            <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-[40px] p-8 shadow-2xl">
               <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Mentor Support</h4>
                  <MentorHint hints={HINTS} onHintUsed={setHintsUsed} />
               </div>
               <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                  <BsShieldLockFill className="text-amber-500 mt-1" />
                  <p className="text-[11px] font-mono text-amber-700 leading-relaxed">
                    Check the unit type! Some facility subunits (like IRFs and IPFs) have different regulatory standings for service bundling.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>

      <DetailedFeedbackModal 
        visible={showFeedback} 
        isCorrect={isCorrectDecision} 
        explanation={getRuleExplanation(QUESTIONS_DATA.level5.scenario, isCorrectDecision)}
        ruleInfo={isCorrectDecision ? "Protocol Audit: Complete." : "Simulation Error: Audit methodology check required."}
        onContinue={finalizeResult} 
      />
    </div>
  );
}
