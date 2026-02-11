
import React, { useState } from 'react';
import { MapPin, X, Sparkles, Heart, Plane, Coffee } from 'lucide-react';
import { Memory } from '../types';

interface MapPageProps {
  memories: Memory[];
}

const MapPage: React.FC<MapPageProps> = ({ memories }) => {
  const [selected, setSelected] = useState<Memory | null>(null);

  const getIcon = (category: string) => {
    if (category.includes('Trip')) return <Plane size={20} />;
    if (category.includes('Meeting')) return <Coffee size={20} />;
    return <Heart size={20} />;
  };

  return (
    <div className="p-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col gap-2 mb-6 mt-4">
        <h2 className="text-3xl font-black italic uppercase text-slate-700">Our Shared World</h2>
        <p className="text-slate-500 font-medium">Every pin holds a story.</p>
      </div>

      {/* Stylized Whimsical Map */}
      <div className="relative w-full aspect-[4/5] bg-[#E1F5FE] border-[4px] border-slate-700 rounded-[3rem] overflow-hidden shadow-[12px_12px_0px_0px_rgba(51,51,51,0.1)]">
        {/* Decorative Map Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-green-200/50 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-100/50 rounded-full blur-2xl" />
        
        {/* Memory Pins */}
        {memories.map((memory) => (
          <button
            key={memory.id}
            onClick={() => setSelected(memory)}
            className="absolute transition-all hover:scale-125 hover:z-30 group active:scale-95 z-10"
            style={{ left: `${memory.x || 50}%`, top: `${memory.y || 50}%` }}
          >
            <div className={`relative bg-white p-2 rounded-2xl border-[3px] border-slate-700 shadow-[4px_4px_0px_0px_#334155] ${selected?.id === memory.id ? 'bg-blush' : 'bg-white'}`}>
              <div className="text-slate-700">
                {getIcon(memory.category)}
              </div>
            </div>
          </button>
        ))}

        {/* Memory Modal Overlay */}
        {selected && (
          <div className="absolute inset-0 bg-slate-700/20 backdrop-blur-[2px] z-40 flex items-center justify-center p-6">
            <div className="bg-white border-[4px] border-slate-700 rounded-[2.5rem] w-full max-w-[300px] p-5 shadow-[10px_10px_0px_0px_#334155] animate-in slide-in-from-bottom-10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-50 px-3 py-1 rounded-full border-[2px] border-rose-100">
                  {selected.category}
                </span>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              
              <div className="aspect-square rounded-2xl border-[2px] border-slate-700 overflow-hidden mb-4">
                <img src={selected.imageUrl} className="w-full h-full object-cover" alt={selected.title} />
              </div>
              
              <h4 className="font-black text-slate-700 text-xl mb-1 leading-tight truncate">{selected.title}</h4>
              <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase flex items-center gap-1">
                <Sparkles size={12} /> {new Date(selected.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-slate-600 italic line-clamp-3 leading-relaxed">"{selected.note}"</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest">
         <Sparkles size={14} className="text-yellow-400" />
         <span>Tap the moments to relive them</span>
         <Sparkles size={14} className="text-yellow-400" />
      </div>
    </div>
  );
};

export default MapPage;
