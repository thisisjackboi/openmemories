
import React from 'react';
import { Award, Lock, CheckCircle, Sparkles } from 'lucide-react';
import { AppState } from '../types';

interface MilestonesProps {
  state: AppState;
}

const MILESTONE_DEFS = [
  { id: '1', title: '100 Days Together', req: 100, type: 'days' },
  { id: '2', title: '1 Year Anniversary', req: 365, type: 'days' },
  { id: '3', title: 'First 10 Memories', req: 10, type: 'memories' },
  { id: '4', title: 'The Jetsetters', req: 3, type: 'trips', desc: '3 Trips Together' },
  { id: '5', title: '5-Year Gold', req: 1825, type: 'days' },
];

const Milestones: React.FC<MilestonesProps> = ({ state }) => {
  const daysTogether = Math.floor((new Date().getTime() - new Date(state.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const tripCount = state.memories.filter(m => m.category.includes('Trip')).length;

  const isUnlocked = (milestone: typeof MILESTONE_DEFS[0]) => {
    if (milestone.type === 'days') return daysTogether >= milestone.req;
    if (milestone.type === 'memories') return state.memories.length >= milestone.req;
    if (milestone.type === 'trips') return tripCount >= milestone.req;
    return false;
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="flex flex-col gap-2 mt-4 text-center">
        <h2 className="text-3xl font-black italic uppercase text-slate-700">Our Milestones</h2>
        <p className="text-slate-500 font-medium">Celebrating every step together.</p>
      </div>

      <div className="bg-blush cartoon-card p-6 flex items-center justify-between text-slate-700 overflow-hidden relative">
        <Sparkles className="absolute -right-4 -bottom-4 text-white/20" size={120} />
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-widest opacity-60">Currently Unlocked</p>
          <p className="text-4xl font-black italic">{MILESTONE_DEFS.filter(isUnlocked).length} / {MILESTONE_DEFS.length}</p>
        </div>
        <Award size={64} className="text-slate-700" />
      </div>

      <div className="space-y-4">
        {MILESTONE_DEFS.map((m) => {
          const unlocked = isUnlocked(m);
          return (
            <div key={m.id} className={`flex items-center gap-4 p-5 rounded-[2rem] border-[3px] transition-all ${unlocked ? 'bg-white border-slate-700 shadow-[4px_4px_0px_0px_#334155]' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
              <div className={`w-14 h-14 rounded-full border-[3px] flex items-center justify-center shadow-inner ${unlocked ? 'bg-lavender border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
                {unlocked ? <CheckCircle className="text-slate-700" size={24} /> : <Lock className="text-slate-400" size={24} />}
              </div>
              <div className="flex-1">
                <h4 className={`font-black text-lg leading-tight ${unlocked ? 'text-slate-700' : 'text-slate-400'}`}>{m.title}</h4>
                <p className="text-xs font-bold text-slate-400">{m.desc || `${m.req} ${m.type} shared`}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Milestones;
