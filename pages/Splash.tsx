
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to onboarding after the intro animation
    const timer = setTimeout(() => {
      const isDone = localStorage.getItem('onboarding_done') === 'true';
      const hasAccount = localStorage.getItem('has_account') === 'true';
      
      if (isDone) {
        navigate('/');
      } else if (hasAccount) {
        navigate('/login');
      } else {
        navigate('/onboarding');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blush animate-in fade-in duration-1000 relative overflow-hidden">
      {/* Decorative background hearts */}
      <Heart className="absolute top-10 left-10 text-white/20 -rotate-12" size={120} />
      <Heart className="absolute bottom-20 right-[-20px] text-white/10 rotate-45" size={200} />
      
      <div className="relative z-10">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/30 rounded-full blur-xl animate-pulse" />
        <div className="relative bg-white p-8 rounded-[3rem] border-[4px] border-slate-700 shadow-[10px_10px_0px_0px_#334155]">
          <Heart className="text-rose-400 fill-rose-400 heart-bounce" size={80} />
          <MapPin className="absolute -bottom-4 -right-4 text-slate-700 bg-sky p-2 rounded-full border-2 border-slate-700" size={36} />
        </div>
      </div>
      
      <div className="mt-12 text-center z-10">
        <h1 className="text-5xl font-black text-slate-700 tracking-tighter">Memory Lane</h1>
        <p className="text-slate-500 font-bold italic mt-3 text-lg">Every Love Story Deserves a Map 💕</p>
      </div>
    </div>
  );
};

export default Splash;
