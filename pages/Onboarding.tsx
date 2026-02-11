
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Map as MapIcon, Calendar, Heart } from 'lucide-react';

interface OnboardingProps {
  onComplete: (userData?: { partner1: string, partner2: string }) => void;
}

const SCREENS = [
  {
    title: "Relive Your Story",
    desc: "A digital scrapbook for the moments that made you 'Us'.",
    icon: <Heart size={64} className="text-rose-400 fill-rose-400" />,
    color: "bg-blush",
  },
  {
    title: "Pin Your Journey",
    desc: "Mark the places where it all happened. From first kisses to big trips.",
    icon: <MapIcon size={64} className="text-sky-600" />,
    color: "bg-sky",
  },
  {
    title: "Grow Together",
    desc: "Watch your timeline bloom as you reach milestones and unlock memories.",
    icon: <Calendar size={64} className="text-lavender-600" />,
    color: "bg-lavender",
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (step < SCREENS.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className={`h-screen flex flex-col items-center justify-between p-8 transition-colors duration-500 ${SCREENS[step].color} relative`}>
      
      {/* Skip Button - Only show on first screens, not on the final screen */}
      {step < SCREENS.length - 1 && (
        <button 
          onClick={() => setStep(SCREENS.length - 1)}
          className="absolute top-6 right-6 bg-white text-slate-700 font-black uppercase text-xs tracking-widest px-4 py-2.5 rounded-full border-[3px] border-slate-700 shadow-[4px_4px_0px_0px_#334155] hover:bg-slate-50 active:translate-y-1 active:shadow-none transition-all z-10"
        >
          Skip
        </button>
      )}

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in slide-in-from-bottom-10">
        <div className="bg-white p-10 rounded-[3rem] border-[4px] border-slate-700 shadow-[10px_10px_0px_0px_#334155]">
          {SCREENS[step].icon}
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-700 uppercase italic leading-none">{SCREENS[step].title}</h2>
          <p className="text-slate-600 font-medium px-4 leading-relaxed">{SCREENS[step].desc}</p>
        </div>
      </div>

      <div className="w-full max-w-xs pb-12 space-y-4">
        <div className="flex justify-center gap-2 mb-8">
          {SCREENS.map((_, i) => (
            <div key={i} className={`h-3 rounded-full transition-all duration-300 ${i === step ? 'w-10 bg-slate-700' : 'w-3 bg-slate-700/20'}`} />
          ))}
        </div>
        
        {step === SCREENS.length - 1 ? (
          <>
            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-slate-700 text-white font-black uppercase tracking-widest py-5 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group active:translate-y-1 active:shadow-none transition-all"
            >
              Create Account
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="text-center">
              <p className="text-slate-600 font-medium text-sm mb-3">
                Already have an account?
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="text-slate-800 font-black text-lg underline decoration-4 decoration-slate-700 underline-offset-4 hover:text-slate-600 hover:decoration-slate-500 transition-all uppercase tracking-wide"
              >
                Login Here
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={next}
            className="w-full bg-slate-700 text-white font-black uppercase tracking-widest py-5 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group active:translate-y-1 active:shadow-none transition-all"
          >
            Next
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
