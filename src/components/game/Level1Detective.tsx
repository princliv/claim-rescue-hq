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
import { BsFileMedicalFill, BsShieldLockFill } from 'react-icons/bs';

interface Props { onComplete: (result: LevelResult) => void; }

const STEPS: InvestigationStep[] = [
  { id: 'mhi', label: 'Check MHI Screen', icon: 'mhi', data: 'MHI Screen Analysis: SB field = Y detected. The system has identified this as a potential facility split billing case.' },
  { id: 'cfi', label: 'Check CFI Screen', icon: 'cfi', data: 'CFI Screen Audit: SPLITBL = Y indicator found. This facility is configured for active split billing rules.' },
  { id: 'dates', label: 'Compare Dates', icon: 'dates', data: 'Timeline Check: Service performed 2 days before admission. This falls within the standard 3-day (72-hour) window.' },
  { id: 'exclusions', label: 'Check Exclusions', icon: 'exclusions', data: 'Exclusion Scan: No service-specific exclusions (Ambulance/Hospice/ASC) found for this 13X TOB claim.' },
];

const HINTS = QUESTIONS_DATA.level1.hints;
const FINAL_DECISION = QUESTIONS_DATA.level1.finalDecision;

export default function Level1Detective({ onComplete }: Props) {
  const [phase, setPhase] = useState<'investigate' | 'quiz' | 'decision'>('investigate');
  const [stepScore, setStepScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [decisionScore, setDecisionScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [bonusScore, setBonusScore] = useState(0);
  const [isCorrectDecision, setIsCorrectDecision] = useState(false);
  const [allStepsDone, setAllStepsDone] = useState(false);
  const timer = useTimer(120);

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
    const correctIdx = QUESTIONS_DATA.level1.finalDecision.correct;
    const isCorrect = (apply ? 0 : 1) === correctIdx;
    
    setIsCorrectDecision(isCorrect);
    setDecisionScore(isCorrect ? 50 : -30);
    setShowFeedback(true);
  };

  const finalizeResult = () => {
    const timeBonus = timer.calculateBonus();
    const total = stepScore + quizScore + decisionScore + timeBonus + bonusScore - (hintsUsed * 10);
    onComplete({
      level: 1,
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
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20 scale-110 blur-[2px]"
        style={{ backgroundImage: `url(${section1Bg})` }}
      />
      
      <GameHUD 
        level={1} 
        title={LEVEL_TITLES[1]} 
        score={stepScore + quizScore + decisionScore} 
        timeLeft={timer.timeLeft} 
        hintsLeft={2 - hintsUsed} 
        onHint={() => setHintsUsed(prev => Math.min(prev + 1, 2))} 
        onHelp={() => setShowGuide(true)}
      />

      <LevelGuideModal 
        visible={showGuide}
        onClose={() => setShowGuide(false)}
        level={1}
        title={LEVEL_TITLES[1]}
        interactionModel="DETECTIVE_INVESTIGATION"
        instructions={[
          "Analyze the MHI Screen first to check the patient's global Split Bill (SB) indicator.",
          "Check the CFI Screen to verify if the facility setup matches the patient's flag.",
          "Complete all investigation steps before making a final audit ruling.",
          "Remember: Facility supports split billing + within timeframe means APPLY."
        ]}
      />

      <div className="flex-1 flex flex-col p-8 relative z-10 w-full max-w-7xl mx-auto main-content-scroll overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <ScenarioCard scenario={QUESTIONS_DATA.level1.scenario} />

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
                questions={QUESTIONS_DATA.level1.mcqs} 
                onComplete={handleQuizComplete} 
              />
            )}

            <DecisionSection 
                onDecision={handleDecision}
                options={QUESTIONS_DATA.level1.finalDecision.options}
                disabled={phase !== 'decision'}
                question={QUESTIONS_DATA.level1.finalDecision.question}
            />
          </div>

          {/* Sidebar / Stats */}
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
               <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                  <BsShieldLockFill className="text-primary mt-1" />
                  <p className="text-[11px] font-mono text-blue-700 leading-relaxed">
                    Always follow the sequence: Extract System Flags → Verify Portal Setup → Analyze Window → Scan Exclusions.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>

      <DetailedFeedbackModal 
        visible={showFeedback} 
        isCorrect={isCorrectDecision} 
        explanation={getRuleExplanation(QUESTIONS_DATA.level1.scenario, isCorrectDecision)}
        ruleInfo={isCorrectDecision ? "Protocol Audit: Complete." : "Simulation Error: Audit methodology check required."}
        onContinue={finalizeResult} 
      />
    </div>
  );
}
