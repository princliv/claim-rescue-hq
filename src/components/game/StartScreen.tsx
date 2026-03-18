import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, BookOpen, Trophy, Shield, Target, ChevronRight, Layers, FileText, Search, Puzzle } from 'lucide-react';
import { useState, useRef } from 'react';
import HowToPlayModal from './HowToPlayModal';
import ParticleField from './ParticleField';
import section1Bg from '@/assets/bg_section1.png';

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
  
  // Ref for the horizontal scroll section
  const horizontalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: horizontalRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

  return (
    <div className="bg-background min-h-screen font-sans text-foreground overflow-x-hidden flex flex-col">

      {/* SECTION 1: Hero Heading - Fixed Pixel Height & Left Aligned */}
      <section 
        className="h-[180px] px-6 md:px-12 xl:px-24 flex flex-col items-start justify-center relative z-10 overflow-hidden border-b border-border/40 bg-cover bg-center"
        style={{ backgroundImage: `url(${section1Bg})` }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-0" />
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
            CLAIM
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-5xl md:text-7xl font-heading font-black text-foreground tracking-tighter leading-none"
          >
            RESCUE
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
      </section>

      {/* SECTION 2: Horizontal Scroll with Side Panel (As per screenshot) */}
      <section ref={horizontalRef} className="h-[110vh] relative z-20 bg-[#f4f7ff] overflow-visible">
        <div className="sticky top-0 h-screen flex overflow-hidden">
          {/* Blue Side Panel (Mirroring the orange one in the screenshot) */}
          <div className="hidden lg:flex w-24 xl:w-32 bg-primary flex-col justify-end pb-12 items-center text-white relative">
            <motion.div 
              style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]) }}
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

          <div className="flex-1 flex flex-col justify-center py-12 relative">
            <div className="px-6 md:px-12 xl:px-24 mb-10">
               <h2 className="text-xs font-mono text-primary font-bold tracking-widest uppercase">Training Modules</h2>
               <p className="text-3xl lg:text-4xl font-heading font-black text-foreground mt-2">5 Progressive Phases</p>
            </div>
            
            <motion.div 
              style={{ x }} 
              className="flex gap-6 px-6 md:px-12 xl:px-24 w-max pointer-events-none"
            >
              {LEVELS.map((level, i) => (
                <div key={i} className="flex-shrink-0 w-[320px] md:w-[450px]">
                  <div className="bg-white rounded-3xl p-10 h-full border border-primary/5 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                    
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 shadow-sm">
                      <level.icon size={26} />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.2em]">{level.title}</h3>
                        <h4 className="text-2xl md:text-3xl font-heading font-black text-foreground leading-tight">{level.name}</h4>
                      </div>
                      <p className="text-xs md:text-sm font-mono text-muted-foreground leading-relaxed">
                        {level.desc}
                      </p>
                      
                      <div className="pt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-primary transition-colors">
                        READ BRIEFING <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Buffer for clean exit */}
              <div className="w-[10vw]"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: High-Impact Blue Start Section */}
      <section className="min-h-screen flex items-center justify-center relative z-30 bg-primary overflow-hidden px-6 py-24 text-white">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl w-full text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            viewport={{ once: true, amount: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-10 shadow-inner border border-white/20">
              <Activity size={40} className="text-white" />
            </div>

            <h2 className="text-5xl md:text-8xl xl:text-[8rem] font-heading font-black tracking-tighter mb-8 leading-none select-none whitespace-nowrap">
              START <span className="text-white/40">GAME</span>
            </h2>

            <p className="text-white/70 font-mono text-sm md:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Your shift is about to begin. Every claim you rescue saves a valid patient encounter. Are you ready, Analyst?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="group relative px-12 py-6 bg-white text-primary font-heading font-black text-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-white/20 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  INITIALIZE SHIFT
                  <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.button>

              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center justify-center gap-2 px-8 py-6 rounded-2xl border-2 border-white/20 font-heading font-bold hover:bg-white/10 transition-all"
              >
                <BookOpen size={20} />
                OPERATIONS MANUAL
              </button>
            </div>
            
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 0.3 }}
               transition={{ delay: 1 }}
               className="mt-16 flex items-center gap-4 text-[10px] font-mono tracking-[0.4em] uppercase"
            >
               <div className="h-px w-12 bg-white" />
               National Medical Claims Division
               <div className="h-px w-12 bg-white" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <HowToPlayModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
