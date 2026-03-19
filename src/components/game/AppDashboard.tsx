import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import DashboardHero from './DashboardHero';
import TrainingProgress from './TrainingProgress';
import LevelCard from './LevelCard';
import './Dashboard.css';

interface AppDashboardProps {
  userStats: {
    score: number;
    accuracy: number;
    completedCount: number;
    avgTime: string;
  };
  levels: Array<{
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'progress' | 'locked' | 'default';
  }>;
  onLevelSelect: (id: number) => void;
  onStartShift: () => void;
  onNavigate: (screen: any) => void;
}

export default function AppDashboard({ userStats, levels, onLevelSelect, onStartShift, onNavigate }: AppDashboardProps) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const handleNavClick = (id: string) => {
    if (id === 'investigations') {
      onNavigate('howToPlay');
    } else {
      setActiveNav(id);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="simulation-overlay" />
      <div className="scanline" />

      <Sidebar
        collapsed={isSidebarCollapsed}
        activeItem={activeNav}
        onItemClick={handleNavClick}
      />

      <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <AnimatePresence mode="wait">
          {activeNav === 'dashboard' ? (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardHero
                score={userStats.score}
                accuracy={userStats.accuracy}
                completedCount={userStats.completedCount}
                onStartShift={onStartShift}
              />

              <TrainingProgress
                completedCount={userStats.completedCount}
                accuracy={userStats.accuracy}
                avgTime={userStats.avgTime}
              />

              <div className="mb-8">
                <h3 className="section-title">Simulation Modules</h3>
                <div className="level-grid">
                  {levels.map(lvl => (
                    <LevelCard
                      key={lvl.id}
                      level={lvl.id}
                      title={lvl.title}
                      description={lvl.description}
                      status={lvl.status}
                      onStart={() => onLevelSelect(lvl.id)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="other-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center min-h-[60vh] text-slate-400 font-mono text-sm uppercase tracking-widest"
            >
              // Accessing {activeNav} module... <br />
              // Security clearance pending.
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
