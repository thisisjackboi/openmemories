
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Sparkles, Send, Loader2, Image as ImageIcon } from 'lucide-react';
import { Memory, MemoryCategory } from '../types';
import { suggestCaption, polishNote } from '../services/geminiService';
import { supabase } from '../services/supabase';

interface AddMemoryProps {
  onAdd: (memory: Memory) => void;
}

const AddMemory: React.FC<AddMemoryProps> = ({ onAdd }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('https://picsum.photos/seed/' + Math.random() + '/400/300'); // Default placeholder
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    locationName: '',
    category: MemoryCategory.OTHER,
    note: ''
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSuggest = async () => {
    if (!formData.title) return alert("Give it a title first!");
    setLoading(true);
    try {
      const suggestion = await suggestCaption(formData.title, "whimsical");
      setFormData(prev => ({ ...prev, note: suggestion }));
    } catch (error) {
      console.error(error);
      alert("Failed to get suggestion. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePolish = async () => {
    if (!formData.note) return alert("Write something first!");
    setLoading(true);
    try {
      const polished = await polishNote(formData.note);
      setFormData(prev => ({ ...prev, note: polished }));
    } catch (error) {
       console.error(error);
       alert("Failed to polish note.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalImageUrl = previewUrl;

      // 1. Upload Image to Supabase if a file is selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`; // Depending on bucket structure, maybe just filename or user folder

        const { error: uploadError } = await supabase.storage
          .from('memories')
          .upload(filePath, selectedFile);

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('memories')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // 2. Create Memory Object
      const newMemory: Memory = {
        id: Date.now().toString(), // Helper ID, backend generates UUID but frontend needs one for optimistic update
        title: formData.title,
        date: formData.date,
        location: {
          name: formData.locationName || 'Somewhere Special',
          x: Math.floor(Math.random() * 70) + 15, // Random position for demo
          y: Math.floor(Math.random() * 70) + 15
        },
        category: formData.category,
        note: formData.note,
        imageUrl: finalImageUrl,
        coupleNames: [] // populated in app state normally
      };

      // 3. Save to App State / Backend (via onAdd)
      onAdd(newMemory);
      navigate('/');
      
    } catch (error: any) {
      console.error("Error creating memory:", error);
      alert(error.message || "Failed to create memory.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 pt-4 pb-12">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-2xl font-black italic uppercase text-slate-800">New Chapter</h2>
        <p className="text-slate-500 font-medium">Capture a piece of your journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div className="relative group bg-slate-100 border-4 border-dashed border-slate-300 rounded-[2rem] aspect-video flex flex-col items-center justify-center overflow-hidden hover:border-slate-400 transition-colors">
          <img src={previewUrl} className={`absolute inset-0 w-full h-full object-cover ${!selectedFile && 'opacity-70 grayscale'}`} alt="Preview" />
          
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all flex items-center justify-center">
             <label className="cursor-pointer bg-white p-4 rounded-full border-4 border-slate-800 cartoon-button shadow-lg hover:scale-110 transition-transform">
                <Camera size={32} className="text-slate-800" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageSelect}
                />
             </label>
          </div>
          {!selectedFile && (
            <div className="absolute bottom-4 bg-white/80 px-4 py-1 rounded-full text-xs font-black uppercase text-slate-600 backdrop-blur-sm pointer-events-none">
              Tap camera to upload photo
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">Memory Title</label>
            <input 
              required
              className="w-full bg-white border-4 border-slate-800 rounded-2xl p-4 font-bold text-slate-800 outline-none focus:ring-4 focus:ring-rose-200 transition-all"
              placeholder="E.g., Our First Kiss"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">When?</label>
              <input 
                type="date"
                required
                className="w-full bg-white border-4 border-slate-800 rounded-2xl p-4 font-bold text-slate-800 outline-none"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">What?</label>
              <select 
                className="w-full bg-white border-4 border-slate-800 rounded-2xl p-4 font-bold text-slate-800 outline-none appearance-none"
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              >
                {Object.values(MemoryCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">Where?</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                className="w-full bg-white border-4 border-slate-800 rounded-2xl p-4 pl-12 font-bold text-slate-800 outline-none"
                placeholder="Location name"
                value={formData.locationName}
                onChange={e => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center px-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Heartfelt Note</label>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={handleSuggest}
                  disabled={loading || uploading}
                  className="flex items-center gap-1 text-[10px] font-black text-rose-500 hover:underline uppercase disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                  Suggest
                </button>
                <button 
                  type="button" 
                  onClick={handlePolish}
                  disabled={loading || uploading}
                  className="flex items-center gap-1 text-[10px] font-black text-blue-500 hover:underline uppercase disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                  Polish
                </button>
              </div>
            </div>
            <textarea 
              rows={4}
              className="w-full bg-white border-4 border-slate-800 rounded-3xl p-5 font-bold text-slate-800 outline-none italic placeholder:not-italic"
              placeholder="Write something sweet about this moment..."
              value={formData.note}
              onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))}
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={uploading || loading}
          className="w-full bg-slate-800 text-white font-black uppercase italic tracking-widest py-5 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(251,113,133,1)] cartoon-button flex items-center justify-center gap-3 active:translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:bg-slate-700"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Saving Memory...
            </>
          ) : (
            <>
              <Send size={24} />
              Save Memory
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddMemory;
