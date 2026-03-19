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
import { BsTruck, BsShieldLockFill, BsFileMedicalFill } from 'react-icons/bs';

interface Props { onComplete: (result: LevelResult) => void; }

const STEPS: InvestigationStep[] = [
  { id: 'mhi', label: 'Check MHI Screen', icon: 'mhi', data: 'MHI Screen Analysis: SB=Y found. The patient record is generally configured for facility split billing.' },
  { id: 'cfi', label: 'Check CFI Screen', icon: 'cfi', data: 'CFI Screen Audit: SPLITBL=Y found. Facility indicators are active for this shift.' },
  { id: 'dates', label: 'Compare Dates', icon: 'dates', data: 'Timeline Check: Service date 12/03 is within 72 hours of admission 12/05. Standard window applies.' },
  { id: 'exclusions', label: 'Check Exclusions', icon: 'exclusions', data: 'Exclusion Scan: Revenue Code 0540 (Ambulance) detected. Clinical protocol dictates that ambulance transport is EXEMPT from split billing.' },
];

const QUESTIONS = QUESTIONS_DATA.level4.mcqs;
const HINTS = QUESTIONS_DATA.level4.hints;
const FINAL_DECISION = QUESTIONS_DATA.level4.finalDecision;

export default function Level4Comparison({ onComplete }: Props) {
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
  const timer = useTimer(180);

  useEffect(() => { timer.start(); }, []);

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
    const correctIdx = QUESTIONS_DATA.level4.finalDecision.correct;
    const isCorrect = (apply ? 0 : 1) === correctIdx;
    
    setIsCorrectDecision(isCorrect);
    setDecisionScore(isCorrect ? 50 : -30);
    setShowFeedback(true);
  };

  const finalizeResult = () => {
    const timeBonus = timer.calculateBonus();
    const total = stepScore + quizScore + decisionScore + timeBonus + bonusScore - (hintsUsed * 10);
    onComplete({
      level: 4,
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
        onClose={() => setShowGuide(false)}
        level={4}
        title={LEVEL_TITLES[4]}
        interactionModel="COMPARISON"
        instructions={[
          "SB=Y and SPLITBL=Y are both set — facility appears configured for split billing.",
          "Check the revenue codes — Rev Code 0540 (Ambulance) is a clinical exclusion.",
          "Clinical exclusions override all facility configuration flags.",
          "Result: Do NOT apply split billing — Ambulance services are always exempt."
        ]}
      />

      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20 scale-110 blur-[2px]"
        style={{ backgroundImage: `url(${section1Bg})` }}
      />
      
      <GameHUD 
        level={4} 
        title={LEVEL_TITLES[4]} 
        score={stepScore + decisionScore} 
        timeLeft={timer.timeLeft} 
        hintsLeft={2-hintsUsed} 
        onHint={() => setHintsUsed(prev => Math.min(prev + 1, 2))} 
      />

      <div className="flex-1 flex flex-col p-8 relative z-10 w-full max-w-7xl mx-auto main-content-scroll overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <ScenarioCard scenario={QUESTIONS_DATA.level4.scenario} />

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
                questions={QUESTIONS_DATA.level4.mcqs} 
                onComplete={handleQuizComplete} 
              />
            )}

            <DecisionSection 
                onDecision={handleDecision}
                options={QUESTIONS_DATA.level4.finalDecision.options}
                disabled={phase !== 'decision'}
                question={QUESTIONS_DATA.level4.finalDecision.question}
            />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <ScorePanel 
              stepScore={stepScore} 
              quizScore={quizScore} 
              decisionScore={decisionScore} 
              timeBonus={timer.isExpired ? 0 : timer.calculateBonus()} 
              totalScore={stepScore + quizScore + decisionScore + (timer.isExpired ? 0 : timer.calculateBonus()) - (hintsUsed * 10)} 
            />
            
            <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Mentor Support</h4>
                  <MentorHint hints={HINTS} onHintUsed={setHintsUsed} />
               </div>
               <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3">
                  <BsShieldLockFill className="text-emerald-500 mt-1" />
                  <p className="text-[11px] font-mono text-emerald-700 leading-relaxed">
                    Audit Checklist: Identity Form Type → Verify Date Window → Scan for Mandatory Exclusions (Ambulance, ESRD, etc).
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>

      <DetailedFeedbackModal 
        visible={showFeedback} 
        isCorrect={isCorrectDecision} 
        explanation={getRuleExplanation(QUESTIONS_DATA.level4.scenario, isCorrectDecision)}
        ruleInfo={isCorrectDecision ? "Protocol Audit: Complete." : "Simulation Error: Audit methodology check required."}
        onContinue={finalizeResult} 
      />
    </div>
  );
}
