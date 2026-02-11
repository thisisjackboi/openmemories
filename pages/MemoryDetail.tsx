
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Heart, Laugh, Trash2 } from 'lucide-react';
import { Memory } from '../types';

interface MemoryDetailProps {
  memories: Memory[];
  onDelete?: (id: string) => void;
}

const MemoryDetail: React.FC<MemoryDetailProps> = ({ memories, onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const memory = memories.find(m => m.id === id);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to forget this memory? 🥺')) {
      if (onDelete && id) {
        onDelete(id);
        navigate('/');
      }
    }
  };

  if (!memory) return <div className="p-10 text-center font-bold">Memory not found!</div>;

  return (
    <div className="min-h-screen bg-cream animate-in slide-in-from-right duration-500 pb-12">
      <div className="relative h-96 w-full">
        <img src={memory.imageUrl} className="w-full h-full object-cover" alt={memory.title} />
        <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/50 to-transparent h-24 p-6 flex items-start justify-between">
          <button onClick={() => navigate(-1)} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
            <ChevronLeft />
          </button>
          
          <div className="flex gap-2">
            {onDelete && (
              <button 
                onClick={handleDelete}
                className="bg-red-500/80 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-600 transition-colors"
                title="Delete Memory"
              >
                <Trash2 size={20} />
              </button>
            )}

          </div>
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white border-[3px] border-slate-700 px-6 py-2 rounded-full shadow-lg font-black uppercase italic text-rose-400 whitespace-nowrap">
          {memory.category}
        </div>
      </div>

      <div className="px-8 mt-16 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-slate-700 leading-tight">{memory.title}</h2>
          <div className="flex items-center justify-center gap-4 text-slate-400 font-bold text-sm">
            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(memory.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {memory.location.name}</span>
          </div>
        </div>

        <div className="relative bg-white border-[3px] border-slate-700 rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_#FFB6C1]">
          <span className="absolute -top-4 -left-2 text-6xl text-rose-200 font-serif">“</span>
          <p className="relative text-lg text-slate-600 italic leading-relaxed text-center z-10">
            {memory.note}
          </p>
          <span className="absolute -bottom-10 -right-2 text-6xl text-rose-200 font-serif rotate-180">“</span>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button className="flex flex-col items-center gap-1 group">
            <div className="w-14 h-14 bg-rose-50 border-[2.5px] border-slate-700 rounded-full flex items-center justify-center group-active:scale-90 transition-all">
              <Heart size={24} className="text-rose-400 fill-rose-400" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400">Loved</span>
          </button>
          <button className="flex flex-col items-center gap-1 group">
            <div className="w-14 h-14 bg-blue-50 border-[2.5px] border-slate-700 rounded-full flex items-center justify-center group-active:scale-90 transition-all">
              <Laugh size={24} className="text-blue-400" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400">Funny</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryDetail;
