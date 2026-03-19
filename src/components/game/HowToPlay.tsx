import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdSearch, 
  MdLayers, 
  MdAccessTime, 
  MdWarning, 
  MdGavel, 
  MdInfoOutline, 
  MdFactCheck,
  MdChevronRight,
  MdPlayCircleOutline
} from 'react-icons/md';
import './HowToPlay.css';

interface AccordionItem {
  id: number;
  title: string;
  explanation: string[];
  whyItMatters: string;
  icon: React.ReactNode;
}

const STEPS: AccordionItem[] = [
  {
    id: 1,
    title: 'Check MHI Screen',
    explanation: ['Locate SB field', 'SB = Y → Facility supports split billing', 'SB = N → No split billing'],
    whyItMatters: 'Determines whether split billing is configured for the facility.',
    icon: <MdSearch size={24} />
  },
  {
    id: 2,
    title: 'Check CFI Screen',
    explanation: ['Look for SPLITBL field', 'Verify indicator is set to Y', 'Check for facility-specific overrides'],
    whyItMatters: 'Confirms the specific claim level indicator is active.',
    icon: <MdLayers size={24} />
  },
  {
    id: 3,
    title: 'Compare Dates',
    explanation: ['Check Service Date vs Admission Date', 'Calculate window (3-day rule)', 'Identify overlaps'],
    whyItMatters: 'Ensures services fall within the mandatory combination window.',
    icon: <MdAccessTime size={24} />
  },
  {
    id: 4,
    title: 'Check Exclusions',
    explanation: ['Identify special service types (Ambulance, Hospice)', 'Verify HCPCS codes against exclusion list', 'Check for ASC service markers'],
    whyItMatters: 'Prevents applying split billing to services that must remain separate.',
    icon: <MdWarning size={24} />
  },
  {
    id: 5,
    title: 'Make Decision',
    explanation: ['Synthesize all findings', 'Apply rule logic', 'Execute ruling in CAS'],
    whyItMatters: 'Final step to resolve the claim edit accurately.',
    icon: <MdGavel size={24} />
  }
];

const RULES = [
  { title: 'SPLITBL Meaning', icon: <MdInfoOutline />, points: ['Y → Applies', 'N → Not applicable', '3 → 3-day rule'] },
  { title: 'SB Field Meaning', icon: <MdFactCheck />, points: ['Y → Enabled', 'N → Not configured'] },
  { title: '3-Day Rule', icon: <MdAccessTime />, points: ['Services within 3 days before admission', 'Must be combined into inpatient billing'] },
  { title: 'Exclusions', icon: <MdWarning />, points: ['Ambulance', 'Hospice', 'ASC'] }
];

interface HowToPlayProps {
  onBack: () => void;
}

const ScanningLine = () => (
  <motion.div 
    initial={{ top: '0%' }}
    animate={{ top: '100%' }}
    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    className="absolute left-0 right-0 h-[2px] bg-blue-500/30 blur-[2px] z-20 pointer-events-none"
  />
);

export default function HowToPlay({ onBack }: HowToPlayProps) {
  const [activeStep, setActiveStep] = useState<number | null>(1);
  const [demoStep, setDemoStep] = useState(0);
  const [demoChoice, setDemoChoice] = useState<string | null>(null);

  const handleDemoAction = () => {
    if (demoStep < 4) setDemoStep(prev => prev + 1);
  };

  const handleDecision = (choice: string) => {
    setDemoChoice(choice);
  };

  return (
    <div className="how-to-play-container">
      {/* 1. Header Section */}
      <header className="htp-header">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1] }}
            transition={{ duration: 0.5, times: [0, 0.2, 0.4, 1] }}
            className="text-blue-400 font-black tracking-widest text-[10px] uppercase block mb-2"
          >
            Training Module_v1
          </motion.span>
          <h1>How Split Bill Investigation Works</h1>
          <h2 className="opacity-80">Follow the structured workflow used by CAS Claims Analysts</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed border-t border-white/5 pt-6 mt-6">
            Master the recursive logic required to identify, audit, and resolve 
            Split Bill (SPLITBL) edits within the CAS claims ecosystem.
          </p>
        </motion.div>
      </header>

      {/* 2. Steps Section (Accordion) */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="htp-accordion-section"
      >
        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-8 border-l-4 border-blue-500 pl-4">Investigation Workflow</h3>
        {STEPS.map((step, idx) => (
          <motion.div 
            key={step.id} 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`htp-accordion-item ${activeStep === step.id ? 'active' : ''}`}
          >
            <button className="htp-accordion-trigger" onMouseEnter={() => setActiveStep(step.id)}>
              <span className="htp-step-number">{step.id}</span>
              <span className="htp-step-title">{step.title}</span>
              <div className="text-slate-400">{step.icon}</div>
            </button>
            <AnimatePresence>
              {activeStep === step.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="htp-accordion-content">
                    <ul>
                      {step.explanation.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <span className="htp-why-matters">
                      <strong>Why this step matters:</strong> {step.whyItMatters}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.section>

      {/* 3. Rules Section (Grid Cards) */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="htp-rules-section"
      >
        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-8 border-l-4 border-blue-500 pl-4">Rule Compendium</h3>
        <div className="htp-rules-grid">
          {RULES.map((rule, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
              className="htp-rule-card"
            >
              <div className="htp-rule-icon">{rule.icon}</div>
              <h3 className="text-blue-400">{rule.title}</h3>
              <ul>
                {rule.points.map((p, i) => <li key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500/50 rounded-full" />
                  {p}
                </li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 4. Mini Case Simulation */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="htp-demo-section"
      >
        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-8 border-l-4 border-blue-500 pl-4 mt-20">Mini Case Simulation</h3>
        <motion.div 
          whileHover={{ boxShadow: "0 0 50px rgba(59, 130, 246, 0.2)" }}
          className="htp-demo-container relative overflow-hidden"
        >
          <ScanningLine />
          <div className="htp-claim-info relative z-10">
             <div className="htp-info-grid">
                <div className="htp-info-item">
                   <span className="htp-info-label">Patient Type</span>
                   <span className="htp-info-value">Hospital Inpatient</span>
                </div>
                <div className="htp-info-item">
                   <span className="htp-info-label">TOB</span>
                   <span className="htp-info-value">111</span>
                </div>
                <div className="htp-info-item">
                   <span className="htp-info-label">Service Date</span>
                   <span className="htp-info-value">Jan 01</span>
                </div>
                <div className="htp-info-item">
                   <span className="htp-info-label">Admit Date</span>
                   <span className="htp-info-value">Jan 03</span>
                </div>
             </div>
          </div>

          {demoStep === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm italic">
                A new clinical edit has triggered on this claim. Initialize investigation to begin.
              </p>
              <button className="htp-btn htp-btn-primary flex items-center gap-2 mx-auto" onClick={handleDemoAction}>
                Start Investigation <MdPlayCircleOutline size={20} />
              </button>
            </div>
          ) : (
            <div className="htp-demo-reveal">
              <AnimatePresence>
                {[...Array(demoStep)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="htp-reveal-step relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-blue-500/5 translate-x-[-100%] animate-scanline pointer-events-none" />
                    <span>
                      {i === 0 && <>Step 1: MHI Result → <strong className="text-blue-400">SB = Y</strong></>}
                      {i === 1 && <>Step 2: CFI Result → <strong className="text-blue-400">SPLITBL = Y</strong></>}
                      {i === 2 && <>Step 3: Comparison → <strong className="text-amber-400">3-Day Window Active</strong></>}
                      {i === 3 && <>Step 4: Exclusions → <strong className="text-emerald-400">None Detected</strong></>}
                    </span>
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-mono font-black text-blue-500/50 uppercase tracking-tighter bg-blue-500/10 px-1.5 py-0.5 rounded">Verified</span>
                       <MdChevronRight className="text-blue-500" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {demoStep < 4 ? (
                <button className="htp-btn htp-btn-outline mt-8 mx-auto self-center" onClick={handleDemoAction}>
                  Execute Next Step
                </button>
              ) : (
                !demoChoice ? (
                  <div className="htp-demo-question">
                    <p className="text-white">Should split billing be applied?</p>
                    <div className="htp-btn-group">
                      <button className="htp-btn htp-btn-primary" onClick={() => handleDecision('apply')}>Apply Split Billing</button>
                      <button className="htp-btn htp-btn-outline" onClick={() => handleDecision('ignore')}>Do Not Apply</button>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className={`htp-feedback ${demoChoice === 'apply' ? '' : 'error'}`}
                  >
                    <h4>{demoChoice === 'apply' ? 'Correct Resolution' : 'Incorrect Resolution'}</h4>
                    <p>
                      {demoChoice === 'apply' 
                        ? 'The 3-day rule applies because the facility is configured for split billing and no exclusions exist.' 
                        : 'The services fall within the 3-day window of a SPLITBL-enabled facility. They must be combined.'}
                    </p>
                    <button className="htp-btn htp-btn-outline mt-6" onClick={() => {setDemoStep(0); setDemoChoice(null);}}>Restart Demo</button>
                  </motion.div>
                )
              )}
            </div>
          )}
        </motion.div>
      </motion.section>

      <div className="text-center mt-20">
        <button className="text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest underline underline-offset-8" onClick={onBack}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
