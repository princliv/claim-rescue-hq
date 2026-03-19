import React from 'react';
import { motion } from 'framer-motion';
import { BsFileMedicalFill, BsCalendarCheck, BsTagFill, BsGearFill } from 'react-icons/bs';
import { LevelScenario } from '@/types/game';

interface Props {
  scenario: LevelScenario;
}

export default function ScenarioCard({ scenario }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-white/10">
          <BsFileMedicalFill size={24} />
        </div>
        <div>
          <h3 className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-[0.3em] leading-none mb-1">Active Claim Scenario</h3>
          <span className="text-2xl font-heading font-black text-white tracking-tight leading-none uppercase">{scenario.patientType}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400">
            <BsTagFill size={14} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Classification</span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold block">TOB Code</span>
              <span className="text-sm font-bold text-white font-mono">{scenario.tob}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold block">Revenue Codes</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {scenario.revenueCodes.map(code => (
                  <span key={code} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-blue-300">{code}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400">
            <BsCalendarCheck size={14} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Timeline</span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold block">Admission Date</span>
              <span className="text-sm font-bold text-white font-mono">{scenario.admissionDate}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold block">Service Date</span>
              <span className="text-sm font-bold text-white font-mono">{scenario.serviceDate}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400">
            <BsGearFill size={14} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">System Indicators</span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold block">SPLITBL Edit</span>
              <span className="text-sm font-bold text-amber-400 font-mono">{scenario.splitBlEdit}</span>
            </div>
            {scenario.hcpcs && scenario.hcpcs.length > 0 && (
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Clinical HCPCS</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {scenario.hcpcs.map(code => (
                    <span key={code} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] font-mono text-blue-400">{code}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-end">
           <div className="p-4 bg-white/5 border border-white/5 rounded-3xl">
              <span className="text-[9px] text-slate-500 uppercase font-black block mb-2">Simulation Objective</span>
              <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                Investigate MHI and CFI screens to validate the flag. Check for service exclusions or 3-day rules.
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
