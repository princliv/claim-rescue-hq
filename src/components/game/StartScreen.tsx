import { motion } from 'framer-motion';
import { Activity, BookOpen, Trophy, Shield, Target, ChevronRight, Layers, FileText, Search, Puzzle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import HowToPlayModal from './HowToPlayModal';
import StartSimulationModal from './StartSimulationModal';
import ParticleField from './ParticleField';
import section2Bg from '@/assets/bg_section2.png';

interface StartScreenProps {
  bestScore: number;
  onStart: () => void;
}

const LEVELS = [
  { title: 'Level 1', name: 'Basic LCD Denial', desc: 'Investigate simple LCD mismatches and find missing authorizations.', icon: Search },
  { title: 'Level 2', name: 'NCD Case Investigation', desc: 'Sort evidence for a National Coverage Determination denial.', icon: FileText },
  { title: 'Level 3', name: 'Authorization Override', desc: 'Check multiple systems (CAS, CGX 2.0) to find valid auth.', icon: Shield },
  { title: 'Level 4', name: 'DX Mismatch Puzzle', desc: 'Verify if the claim diagnosis matches the authorization exactly.', icon: Puzzle },
  { title: 'Level 5', name: 'Multi-Service Manager', desc: 'Handle claims with multiple service lines and distinct rules.', icon: Layers },
];

export default function StartScreen({ bestScore, onStart }: StartScreenProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scrolling marquee settings
  const marqueeDuration = 30;

  return (
    <div className="bg-background min-h-screen font-sans text-foreground overflow-x-hidden flex flex-col">

      {/* SECTION 1: Hero Heading - Fixed Pixel Height & Left Aligned */}
      <section
        className="h-[180px] flex relative z-10 overflow-hidden"
      >
        {/* Blue Side Panel (Mirroring Section 2 for continuity) */}
        <div className="hidden lg:flex w-24 xl:w-32 bg-primary flex-col items-center pt-12 flex-shrink-0 relative">
          {/* Decorative dots to match side panel theme */}
          <div className="flex flex-col gap-1 opacity-40">
            <div className="w-1 h-1 bg-white rounded-full scale-110"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full scale-90"></div>
          </div>
        </div>

        <div
          className="flex-1 px-6 md:px-12 xl:px-[120px] flex flex-col items-start justify-center relative bg-background"
        >
          <ParticleField />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary font-mono text-[10px] mb-4 relative z-10"
          >
            <Target size={10} />
            Professional Clinical Training Simulation
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:gap-4 relative z-10">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-7xl font-heading font-black text-primary tracking-tighter leading-none"
            >
              ANALYTICAL
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-5xl md:text-7xl font-heading font-black text-foreground tracking-tighter leading-none"
            >
              SUITE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 md:mt-0 md:mb-1 text-sm text-muted-foreground font-mono max-w-sm border-l-0 md:border-l md:pl-4 border-border/60"
            >
              Master the art of LCD/NCD compliance and investigation.
            </motion.p>
          </div>

          {bestScore > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-warning/30 shadow-sm text-foreground font-mono text-[11px] relative z-10"
            >
              <Trophy size={12} className="text-warning" />
              RECORD: {bestScore} PTS
            </motion.div>
          )}
        </div>
      </section>

      {/* SECTION 2: Fixed height with Auto Marquee and Top-Right Action */}
      <section 
        className="flex-1 min-h-[500px] lg:h-[calc(100vh-180px)] relative z-20 flex overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${section2Bg})` }}
      >
        {/* Subtle black overlay for cinematic medical aesthetic */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        
        {/* Blue Side Panel */}
        <div className="hidden lg:flex w-24 xl:w-32 bg-primary flex-col justify-end pb-12 items-center text-white relative flex-shrink-0">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="vertical-text font-heading font-black text-2xl tracking-[0.2em] whitespace-nowrap -rotate-90 origin-center mb-24"
          >
            INVESTIGATIONS
          </motion.div>
          <div className="absolute top-12 left-0 right-0 flex flex-col items-center gap-1 opacity-40">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center py-12 relative overflow-hidden">
          {/* Top Right Start Button - Repositioned as requested */}
          <div className="absolute top-10 right-10 lg:right-16 z-30 flex items-center gap-4">
            <button
              onClick={() => setShowHelp(true)}
              className="hidden sm:flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-heading font-bold hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
            >
              <BookOpen size={16} />
              Manual
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="group relative px-10 py-4 bg-white text-primary font-heading font-black text-lg rounded-xl shadow-2xl hover:shadow-white/20 transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                INITIALIZE SHIFT
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </div>

          <div className="px-6 md:px-12 xl:px-24 mb-10 relative z-10">
            <h2 className="text-xs font-mono text-primary-foreground font-bold tracking-widest uppercase opacity-80">Training Modules</h2>
            <p className="text-3xl lg:text-4xl font-heading font-black text-white mt-2">5 Progressive Phases</p>
          </div>

          <div className="relative overflow-hidden w-full px-6 md:px-12 xl:px-24">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: marqueeDuration,
                repeat: Infinity,
                ease: "linear"
              }}
              whileHover={{ animationPlayState: "paused" }}
              className="flex gap-6 w-max"
            >
              {[...LEVELS, ...LEVELS].map((level, i) => (
                <div key={i} className="flex-shrink-0 w-[300px] md:w-[400px]">
                  <div className="bg-white/95 backdrop-blur-sm rounded-[32px] p-8 md:p-10 h-full border border-white/20 shadow-sm relative overflow-hidden group hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-primary/30 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                      <level.icon size={22} />
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <h3 className="text-[9px] font-mono font-bold text-primary uppercase tracking-[0.2em]">{level.title}</h3>
                        <h4 className="text-xl md:text-2xl font-heading font-black text-foreground leading-tight">{level.name}</h4>
                      </div>
                      <p className="text-[11px] md:text-xs font-mono text-muted-foreground leading-relaxed">
                        {level.desc}
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-[9px] font-mono font-bold text-primary transition-colors group-hover:gap-3">
                        READ BRIEFING <ChevronRight size={10} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <HowToPlayModal open={showHelp} onClose={() => setShowHelp(false)} />
      
      <StartSimulationModal 
        visible={showWelcome} 
        onEnterGame={() => {
          setShowWelcome(false);
          onStart();
        }}
        onReadMore={() => setShowWelcome(false)}
      />
    </div>
  );
}
