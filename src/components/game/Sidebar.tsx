import React from 'react';
import { motion } from 'framer-motion';
import { 
  MdDashboard, 
  MdHelpOutline, 
  MdOutlineTerminal 
} from 'react-icons/md';

interface SidebarProps {
  collapsed: boolean;
  activeItem: string;
  onItemClick: (id: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <MdDashboard size={24} /> },
  { id: 'investigations', label: 'How to Play', icon: <MdHelpOutline size={24} /> },
];

export default function Sidebar({ collapsed, activeItem, onItemClick }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo px-6 flex items-center gap-3 border-b border-white/5 mb-8">
        <div className="w-9 h-9 bg-primary-blue rounded-xl flex items-center justify-center text-white shrink-0 shadow-xl shadow-blue-500/20 ring-1 ring-white/20">
          <MdOutlineTerminal size={22} />
        </div>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="font-black tracking-widest text-[11px] uppercase leading-none text-white">CAS_DETECTIVE</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Simulation_V2.0</span>
          </motion.div>
        )}
      </div>

      <nav className="sidebar-nav px-3 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <div className="shrink-0">{item.icon}</div>
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="font-bold text-xs uppercase tracking-widest"
                >
                  {item.label}
                </motion.span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-4">
         {!collapsed ? (
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase block mb-1">Sim_Status</span>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-white uppercase">Active_Uplink</span>
              </div>
           </div>
         ) : (
           <div className="mx-auto w-3 h-3 rounded-full bg-emerald-500 animate-pulse border-2 border-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
         )}
      </div>
    </aside>
  );
}
