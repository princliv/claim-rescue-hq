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
import section2Bg from '@/assets/bg_section2.png';

// Icons
import { BsFileMedicalFill, BsShieldLockFill } from 'react-icons/bs';

interface Props { onComplete: (result: LevelResult) => void; }

const STEPS: InvestigationStep[] = [
  { id: 'mhi', label: 'Check MHI Screen', icon: 'mhi', data: 'MHI Screen Analysis: SB=N found. Indicator suggests this is a professional/physician claim, not a facility claim.' },
  { id: 'cfi', label: 'Check CFI Screen', icon: 'cfi', data: 'CFI Screen Audit: No SPLITBL field present. Physician configuration does not support facility split billing logic.' },
  { id: 'dates', label: 'Compare Dates', icon: 'dates', data: 'Timeline Check: Service date 10/11 is within 24 hours of admission 10/12. While timely, the claim type is exempt.' },
  { id: 'exclusions', label: 'Check Exclusions', icon: 'exclusions', data: 'Exclusion Scan: Professional claims are globally excluded from CAS facility split billing edits.' },
];

const HINTS = QUESTIONS_DATA.level2.hints;
const FINAL_DECISION = QUESTIONS_DATA.level2.finalDecision;

export default function Level2DragDrop({ onComplete }: Props) {
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
  const timer = useTimer(150);

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
    const correctIdx = QUESTIONS_DATA.level2.finalDecision.correct;
    const isCorrect = (apply ? 0 : 1) === correctIdx;
    
    setIsCorrectDecision(isCorrect);
    setDecisionScore(isCorrect ? 50 : -30);
    setShowFeedback(true);
  };

  const finalizeResult = () => {
    const timeBonus = timer.calculateBonus();
    const total = stepScore + quizScore + decisionScore + timeBonus + bonusScore - (hintsUsed * 10);
    onComplete({
      level: 2,
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
        level={2}
        title="Physician Claims Logic"
        interactionModel="DETECTIVE_INVESTIGATION"
        instructions={[
          "Analyze the claim type; professional claims follow different rules than facilities.",
          "Check the MHI screen for the 'SB' indicator—it should be 'N' for physicians.",
          "The '3-Day Rule' only applies to inpatient facility records.",
          "Result: Do NOT apply split billing for physician claims."
        ]}
      />

      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20 scale-110 blur-[2px]"
        style={{ backgroundImage: `url(${section2Bg})` }}
      />
      
      <GameHUD 
        level={2} 
        title={LEVEL_TITLES[2]} 
        score={stepScore + decisionScore} 
        timeLeft={timer.timeLeft} hintsLeft={2-hintsUsed} onHint={() => setHintsUsed(s => Math.min(s+1, 2))} />
      <div className="flex-1 flex flex-col p-8 relative z-10 w-full max-w-7xl mx-auto main-content-scroll overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <ScenarioCard scenario={QUESTIONS_DATA.level2.scenario} />

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
                questions={QUESTIONS_DATA.level2.mcqs} 
                onComplete={handleQuizComplete} 
              />
            )}

            <DecisionSection 
                onDecision={handleDecision}
                options={QUESTIONS_DATA.level2.finalDecision.options}
                disabled={phase !== 'decision'}
                question={QUESTIONS_DATA.level2.finalDecision.question}
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
            
            <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-[40px] p-8 shadow-2xl">
               <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Mentor Support</h4>
                  <MentorHint hints={HINTS} onHintUsed={setHintsUsed} />
               </div>
               <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                  <BsShieldLockFill className="text-amber-500 mt-1" />
                  <p className="text-[11px] font-mono text-amber-700 leading-relaxed">
                    Remember: professional claims used CMS 1500 (HCFA) forms. These are generally immune to facility-based 3-day rules.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>

      <DetailedFeedbackModal 
        visible={showFeedback} 
        isCorrect={isCorrectDecision} 
        explanation={getRuleExplanation(QUESTIONS_DATA.level2.scenario, isCorrectDecision)}
        ruleInfo={isCorrectDecision ? "Protocol Audit: Complete." : "Simulation Error: Audit methodology check required."}
        onContinue={finalizeResult} 
      />
    </div>
  );
}
