
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Share2, Heart, Sparkles, ArrowRight, Copy, Check } from 'lucide-react';

const PartnerConnect: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const inviteLink = "memorylane.app/join/couple-123-abc";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send an invite
    alert(`Invite sent to ${email}!`);
    navigate('/');
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700 pt-10">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-white p-6 rounded-[2.5rem] border-[4px] border-slate-700 shadow-[8px_8px_0px_0px_#334155] relative">
          <Heart className="text-rose-400 fill-rose-400 heart-bounce" size={48} />
          <Sparkles className="absolute -top-2 -right-2 text-yellow-400" size={24} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-700 uppercase italic">Better Together</h2>
          <p className="text-slate-500 font-medium px-4 leading-relaxed">
            Invite your partner to start pinning your favorite moments on the map together.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Email Invite Form */}
        <form onSubmit={handleInvite} className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">Partner's Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email"
              required
              className="w-full bg-white border-[3px] border-slate-700 rounded-2xl p-4 pl-12 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-rose-100 transition-all"
              placeholder="their-email@love.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-slate-700 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(51,51,51,0.2)] flex items-center justify-center gap-2 group active:translate-y-1 transition-all"
          >
            Send Invite
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="flex items-center gap-4 py-2">
          <div className="h-[2px] flex-1 bg-slate-200" />
          <span className="text-[10px] font-black uppercase text-slate-300">or share a link</span>
          <div className="h-[2px] flex-1 bg-slate-200" />
        </div>

        {/* Share Link Card */}
        <div className="bg-sky border-[3px] border-slate-700 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_#334155]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Share2 size={18} className="text-sky-700" />
              <span className="font-black text-xs uppercase text-sky-700 tracking-widest">Invite Link</span>
            </div>
            <button 
              onClick={handleCopy}
              className="p-2 bg-white rounded-full border-2 border-slate-700 active:scale-90 transition-all"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
          </div>
          <p className="bg-white/50 border-2 border-dashed border-sky-400 p-3 rounded-xl text-xs font-bold text-sky-800 break-all">
            {inviteLink}
          </p>
        </div>
      </div>

      <div className="pt-4 text-center">
        <button 
          onClick={() => navigate('/')} 
          className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
        >
          I'll connect later
        </button>
      </div>
    </div>
  );
};

export default PartnerConnect;
