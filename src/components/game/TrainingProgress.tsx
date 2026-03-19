import React from 'react';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdAccessTime, MdPercent } from 'react-icons/md';

interface ProgressProps {
  completedCount: number;
  accuracy: number;
  avgTime: string;
}

export default function TrainingProgress({ completedCount, accuracy, avgTime }: ProgressProps) {
  const progressPercent = (completedCount / 5) * 100;

  return (
    <section className="progress-section">
      <div className="progress-header">
        <h3 className="text-lg font-black tracking-tight text-slate-800 uppercase">Training Progress</h3>
        <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest leading-none">Status: {progressPercent}% Certified</span>
      </div>

      <div className="progress-bar-container">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="progress-bar-fill"
        />
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <div className="flex items-center gap-2 mb-1">
            <MdCheckCircle className="text-blue-500" size={16} />
            <span className="stat-label">Levels Completed</span>
          </div>
          <span className="stat-value">{completedCount}/5</span>
        </div>
        
        <div className="stat-item">
          <div className="flex items-center gap-2 mb-1">
            <MdPercent className="text-cyan-500" size={16} />
            <span className="stat-label">Accuracy</span>
          </div>
          <span className="stat-value">{accuracy}%</span>
        </div>

        <div className="stat-item">
          <div className="flex items-center gap-2 mb-1">
            <MdAccessTime className="text-purple-500" size={16} />
            <span className="stat-label">Avg Time</span>
          </div>
          <span className="stat-value font-mono tracking-tighter">{avgTime}</span>
        </div>
      </div>
    </section>
  );
}
