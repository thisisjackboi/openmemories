
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Award, MapPin, Sparkles, Plus } from 'lucide-react';
import { AppState, MemoryCategory } from '../types';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const daysTogether = Math.floor((new Date().getTime() - new Date(state.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center mt-4">
        <div>
          <h2 className="text-3xl font-black text-slate-700 leading-none">Hi, {state.partner1} & {state.partner2}!</h2>
          <p className="text-rose-400 font-bold mt-1 uppercase text-xs tracking-widest">Shared {daysTogether} days of love ✨</p>
        </div>
        <Link to="/profile" className="w-14 h-14 rounded-full border-[3px] border-slate-700 bg-white overflow-hidden shadow-[4px_4px_0px_0px_#334155] active:translate-y-1 active:shadow-none transition-all">
          <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${state.partner1}`} alt="Profile" />
        </Link>
      </header>

      {/* Main Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-sky cartoon-card p-6 flex flex-col items-center gap-2 relative opacity-80 cursor-not-allowed">
          <MapPin size={32} className="text-sky-700" />
          <span className="font-black uppercase tracking-widest text-sm">View Map</span>
          <span className="absolute -top-3 -right-3 bg-rose-400 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-slate-700 transform rotate-12 shadow-sm">
            Soon!
          </span>
        </div>
        <Link to="/milestones" className="bg-lavender cartoon-card p-6 flex flex-col items-center gap-2 hover:translate-y-[-4px] transition-transform">
          <Award size={32} className="text-lavender-700" />
          <span className="font-black uppercase tracking-widest text-sm">Milestones</span>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-[3px] border-slate-700 rounded-[2rem] p-5 flex items-center justify-around shadow-[8px_8px_0px_0px_#334155]">
        <div className="text-center">
          <div className="text-2xl font-black text-slate-700">{state.memories.length}</div>
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Memories</div>
        </div>
        <div className="w-[2px] h-8 bg-slate-100" />
        <div className="text-center">
          <div className="text-2xl font-black text-slate-700">{state.memories.filter(m => m.category === MemoryCategory.TRIP).length}</div>
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Trips</div>
        </div>
        <div className="w-[2px] h-8 bg-slate-100" />
        <div className="text-center">
          <div className="text-2xl font-black text-slate-700">{state.memories.filter(m => m.category === MemoryCategory.MILESTONE).length}</div>
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Milestones</div>
        </div>
      </div>

      {/* Recent Memories Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black italic text-slate-700 uppercase tracking-tight">Recent Snaps</h3>
          <Link to="/timeline" className="text-rose-400 font-bold text-sm hover:underline uppercase tracking-widest">See All</Link>
        </div>
        
        {state.memories.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-6 -mx-2 px-2 snap-x">
            {state.memories.slice(0, 3).map((memory, i) => (
              <Link 
                key={memory.id} 
                to={`/memory/${memory.id}`}
                className={`polaroid snap-center shrink-0 w-64 ${i % 2 === 0 ? 'rotate-[-2deg]' : 'rotate-[2deg]'} hover:rotate-0 transition-all`}
              >
                <div className="aspect-square bg-slate-100 mb-3 border-[1.5px] border-slate-700 overflow-hidden rounded-lg">
                  <img src={memory.imageUrl} className="w-full h-full object-cover" alt={memory.title} />
                </div>
                <h4 className="font-black text-slate-700 leading-tight truncate">{memory.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">@{memory.location.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border-4 border-dashed border-slate-200 rounded-[2.5rem]">
             <Sparkles className="mx-auto text-yellow-400 mb-2 animate-pulse" size={40} />
             <p className="text-slate-400 font-bold italic px-10">No memories pinned yet.</p>
             <Link to="/add" className="mt-4 inline-flex items-center gap-2 bg-blush px-6 py-2 rounded-full border-[3px] border-slate-700 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#334155]">
               <Plus size={16} /> Create One
             </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
