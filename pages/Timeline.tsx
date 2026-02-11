
import React from 'react';
import { Calendar, Heart } from 'lucide-react';
import { Memory } from '../types';

interface TimelineProps {
  memories: Memory[];
}

const Timeline: React.FC<TimelineProps> = ({ memories }) => {
  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pt-4 pb-12">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-2xl font-black italic uppercase text-slate-800">The Love Timeline</h2>
        <p className="text-slate-500 font-medium">Where we started, and where we are.</p>
      </div>

      <div className="relative pl-8 space-y-12">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-1 bg-slate-800 rounded-full" />
        
        {sortedMemories.map((memory, index) => (
          <div key={memory.id} className="relative">
            {/* Timeline Dot */}
            <div className="absolute -left-[35px] top-4 w-10 h-10 bg-white border-4 border-slate-800 rounded-full flex items-center justify-center z-10 shadow-[2px_2px_0px_0px_rgba(51,51,51,1)]">
              {index === sortedMemories.length - 1 ? (
                <Heart className="text-rose-500 fill-rose-500" size={16} />
              ) : (
                <div className="w-2 h-2 bg-slate-800 rounded-full" />
              )}
            </div>

            <div className="bg-white border-4 border-slate-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(30,30,30,1)] transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 px-2 py-0.5 bg-rose-50 rounded-full border-2 border-rose-100">
                  {memory.category}
                </span>
                <div className="flex items-center gap-1 text-slate-400">
                  <Calendar size={12} />
                  <span className="text-[10px] font-bold">{new Date(memory.date).toLocaleDateString()}</span>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-2">{memory.title}</h3>
              
              {memory.imageUrl && (
                <div className="rounded-2xl border-2 border-slate-800 overflow-hidden mb-4 aspect-video">
                  <img src={memory.imageUrl} className="w-full h-full object-cover" alt={memory.title} />
                </div>
              )}
              
              <div className="relative">
                <span className="absolute -left-2 top-0 text-3xl text-rose-200 font-serif">"</span>
                <p className="text-sm text-slate-600 pl-4 italic leading-relaxed">
                  {memory.note}
                </p>
                <span className="absolute -right-2 bottom-0 text-3xl text-rose-200 font-serif rotate-180">"</span>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">@{memory.location.name}</span>
              </div>
            </div>
          </div>
        ))}

        {sortedMemories.length === 0 && (
          <div className="text-center py-20 bg-white border-4 border-dashed border-slate-300 rounded-3xl">
            <p className="text-slate-400 font-bold italic">No stories yet... Start writing yours!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
