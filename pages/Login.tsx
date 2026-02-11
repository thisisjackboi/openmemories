
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Heart } from 'lucide-react';

import { supabase } from '../services/supabase';

interface LoginProps {
  onComplete: (userData?: { partner1: string, partner2: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Fetch profile to get names
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('partner1_name, partner2_name')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error("Profile not found:", profileError);
          // Fallback if no profile
          onComplete(); 
        } else {
          onComplete({ partner1: profileData.partner1_name, partner2: profileData.partner2_name });
        }
        
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-[3rem] border-[4px] border-slate-700 shadow-[10px_10px_0px_0px_#334155] animate-in slide-in-from-bottom-5">
        
        <div className="flex justify-center mb-6">
          <div className="bg-blush-100 p-4 rounded-full border-[3px] border-slate-700 shadow-[4px_4px_0px_0px_#334155]">
            <Heart size={40} className="text-sky-500 fill-sky-500 heart-bounce" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-700 text-center mb-2 font-['Baloo_2'] uppercase italic">
          Welcome Back
        </h2>
        <p className="text-slate-500 text-center font-medium mb-8">
          Continue your shared journey.
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold text-center border-2 border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-slate-700 font-bold ml-2 uppercase text-xs tracking-widest">Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                id="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border-[3px] border-slate-700 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all placeholder:text-slate-300"
                placeholder="love@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-bold ml-2 uppercase text-xs tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                id="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-50 border-[3px] border-slate-700 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all placeholder:text-slate-300"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(51,51,51,0.5)] flex items-center justify-center gap-2 group active:translate-y-1 active:shadow-none transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entering...' : 'Enter Our World'}
            {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 font-medium text-sm">
            Just started? {' '}
            <Link to="/signup" className="text-slate-800 font-black underline decoration-2 decoration-sky-400 underline-offset-2 hover:text-sky-600 transition-colors">
              Create a new space
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
