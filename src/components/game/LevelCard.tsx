import React from 'react';
import { motion } from 'framer-motion';
import {
  MdLock,
  MdCheckCircle,
  MdPlayArrow,
  MdChevronRight,
  MdSearch,
  MdLayers,
  MdAdminPanelSettings,
  MdOutlineMedicalServices,
  MdPsychology
} from 'react-icons/md';

interface LevelCardProps {
  level: number;
  title: string;
  description: string;
  status: 'completed' | 'progress' | 'locked' | 'default';
  onStart: () => void;
}

const LEVEL_ICONS: Record<number, React.ReactNode> = {
  1: <MdSearch size={28} />,
  2: <MdLayers size={28} />,
  3: <MdAdminPanelSettings size={28} />,
  4: <MdOutlineMedicalServices size={28} />,
  5: <MdPsychology size={28} />,
};

export default function LevelCard({ level, title, description, status, onStart }: LevelCardProps) {
  const isLocked = status === 'locked';
  const complexity = level <= 2 ? 1 : level <= 4 ? 2 : 3;

  const getButtonProps = () => {
    switch (status) {
      case 'completed': return { label: 'Review Audit', className: 'cta-secondary' };
      case 'progress': return { label: 'Resume Investigation', className: 'cta-primary' };
      case 'locked': return { label: 'Security Locked', className: 'cta-locked', disabled: true };
      default: return { label: 'Begin Audit', className: 'cta-primary' };
    }
  };

  const btn = getButtonProps();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: level * 0.1 }}
      className={`level-card ${isLocked ? 'locked' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="level-badge">Module 0{level}</span>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 w-3 rounded-full ${i <= complexity ? 'bg-primary-blue' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
        {status === 'completed' && <MdCheckCircle className="text-emerald-500" size={18} />}
        {status === 'locked' && <MdLock className="text-slate-300" size={18} />}
      </div>

      <div className="level-icon-wrapper">
        {LEVEL_ICONS[level] || <MdPlayArrow size={28} />}
      </div>

      <div>
        <h4 className="level-title tracking-tight">{title}</h4>
        <p className="level-desc">{description}</p>
      </div>

      <div className={`level-status`}>
        {status === 'completed' && <span className="status-completed uppercase tracking-widest text-[10px] font-black">Audit Verified</span>}
        {status === 'progress' && <span className="status-progress uppercase tracking-widest text-[10px] font-black">In Progress</span>}
        {status === 'locked' && <span className="status-locked uppercase tracking-widest text-[10px] font-black">Security Lock</span>}
      </div>

      <button
        className={`cta-button ${btn.className}`}
        disabled={btn.disabled}
        onClick={onStart}
      >
        <span className="flex items-center justify-center gap-2">
          {btn.label} <MdChevronRight size={18} />
        </span>
      </button>

      {isLocked && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-200" />
      )}
    </motion.div>
  );
}
