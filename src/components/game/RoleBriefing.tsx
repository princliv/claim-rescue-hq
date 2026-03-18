import React from 'react';
import { motion } from 'framer-motion';
import { MdOutlineFingerprint, MdArrowForward, MdLabelOutline, MdTune, MdHistoryEdu, MdOutlineSecurity } from 'react-icons/md';
import ParticleField from './ParticleField';
import analystAvatar from '@/assets/avatar2.png';

interface Props {
  onContinue: () => void;
}

export default function RoleBriefing({ onContinue }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0f18] text-white flex flex-col font-sans overflow-hidden">
      <ParticleField />
      
      {/* Top Professional HUD */}
      <header className="fixed top-0 inset-x-0 h-20 border-b border-white/5 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-between px-10">
        <div className="flex items-center gap-4">
           <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg border border-amber-500/20">
              <MdOutlineSecurity size={20} />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-1">Authorization_Level_03</span>
              <span className="text-sm font-heading font-black tracking-widest uppercase">Senior Analyst Protocol</span>
           </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bg-white/5 border border-white/10 rounded-full px-8 py-2 text-[10px] font-mono font-black tracking-[0.4em] uppercase">
           Personnel_Laboratory
        </div>

        <div className="flex items-center gap-8">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-1">Current_System</span>
              <span className="text-sm font-heading font-black tracking-widest uppercase text-emerald-500">Online_Sync</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-mono font-black text-xs">
              01
           </div>
        </div>
      </header>

      {/* Main Briefing Room */}
      <main className="flex-1 flex items-center justify-center relative p-10 mt-10">
        
        {/* Left Side: Stats & Metrics */}
        <div className="absolute left-20 top-1/2 -translate-y-1/2 w-64 space-y-12 z-30">
           <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex justify-between items-end mb-2">
                 <span className="text-[10px] font-mono text-slate-500 uppercase">Detection_Rate</span>
                 <span className="text-xs font-mono text-white">99.8%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: '99.8%' }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex justify-between items-end mb-2">
                 <span className="text-[10px] font-mono text-slate-500 uppercase">Analysis_XP</span>
                 <span className="text-xs font-mono text-white">8,400</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.5, delay: 0.6 }} className="h-full bg-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="pt-8 border-t border-white/5">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-4">Core_Directives</span>
              <ul className="space-y-4">
                 <li className="flex items-center gap-3 text-xs font-mono text-white/70">
                    <MdTune className="text-primary" /> Investigator Protocol
                 </li>
                 <li className="flex items-center gap-3 text-xs font-mono text-white/70">
                    <MdHistoryEdu className="text-primary" /> LCD/NCD Compliance
                 </li>
              </ul>
           </motion.div>
        </div>

        {/* Center: The Analyst Character */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-[32rem] h-[32rem] flex items-center justify-center"
          >
            {/* Holographic Circular Base */}
            <div className="absolute inset-0 border-2 border-white/5 rounded-full animate-rotate-slow" />
            <div className="absolute inset-4 border border-primary/20 rounded-full animate-radar" />
            <div className="absolute inset-[-40px] border border-white/5 rounded-full opacity-20" />
            
            {/* Character Image */}
            <img 
              src={analystAvatar} 
              alt="Medical Claims Analyst" 
              className="relative z-20 h-full w-auto object-contain drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8 -translate-y-12 relative z-30"
          >
            <h1 className="text-6xl font-heading font-black tracking-tighter uppercase leading-none mb-2 drop-shadow-lg">
               Claims <span className="text-primary">Analyst</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.5em] mb-8">System_Designation: Guardian_01</p>
          </motion.div>
        </div>

        {/* Right Side: Deployment Module */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-64 space-y-6 z-30">
           <motion.div
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
           >
              <h3 className="text-sm font-heading font-black uppercase tracking-widest mb-6">Mission Control</h3>
              <p className="text-[10px] font-mono text-slate-500 leading-relaxed uppercase tracking-tighter mb-8">
                Initialize the command dashboard to begin your high-level clinical investigations.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
                className="w-full flex items-center justify-between p-6 bg-primary text-white rounded-2xl font-heading font-black text-sm tracking-widest uppercase shadow-2xl shadow-primary/30 hover:bg-blue-600 transition-all group"
              >
                <span>Deploy</span>
                <MdArrowForward size={18} className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
           </motion.div>

           <div className="px-4 opacity-30">
              <div className="flex justify-between text-[9px] font-mono text-slate-500 tracking-widest mb-2">
                 <span>BIOMETRIC_SYNC</span>
                 <span>100%</span>
              </div>
              <div className="h-0.5 bg-slate-800 rounded-full">
                 <div className="h-full bg-white w-full" />
              </div>
           </div>
        </div>
      </main>

      {/* Bottom Action Footer */}
      <footer className="fixed bottom-0 inset-x-0 h-16 border-t border-white/5 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center px-10">
         <div className="flex items-center gap-12 font-mono text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
            <span className="text-primary">01_ANALYSIS</span>
            <span className="opacity-40">02_ADJUDICATION</span>
            <span className="opacity-40">03_SETTLEMENT</span>
            <span className="opacity-40">04_VERIFICATION</span>
         </div>
      </footer>
    </div>
  );
}
