
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '../services/supabase';

interface SignupProps {
  onComplete: (userData?: { partner1: string, partner2: string }) => void;
}

const Signup: React.FC<SignupProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    partnerName: '',
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
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id,
              partner1_name: formData.name,
              partner2_name: formData.partnerName,
              start_date: new Date().toISOString() // flexible start date
            }
          ]);

        if (profileError) throw profileError;

        // 3. Complete onboarding
        onComplete({ partner1: formData.name, partner2: formData.partnerName });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blush flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-[3rem] border-[4px] border-slate-700 shadow-[10px_10px_0px_0px_#334155] animate-in slide-in-from-bottom-5">
        
        <div className="flex justify-center mb-6">
          <div className="bg-sky-100 p-4 rounded-full border-[3px] border-slate-700 shadow-[4px_4px_0px_0px_#334155]">
            <Heart size={40} className="text-rose-500 fill-rose-500 heart-bounce" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-700 text-center mb-2 font-['Baloo_2'] uppercase italic">
          Create Account
        </h2>
        <p className="text-slate-500 text-center font-medium mb-8">
          Begin your shared journey today.
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold text-center border-2 border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-slate-700 font-bold ml-2 uppercase text-xs tracking-widest">Your Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                id="name"
                type="text" 
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border-[3px] border-slate-700 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-rose-200 transition-all placeholder:text-slate-300"
                placeholder="Romeo"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-bold ml-2 uppercase text-xs tracking-widest">Partner's Name</label>
            <div className="relative">
              <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                id="partnerName"
                type="text" 
                value={formData.partnerName}
                onChange={handleChange}
                className="w-full bg-slate-50 border-[3px] border-slate-700 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-rose-200 transition-all placeholder:text-slate-300"
                placeholder="Juliet"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-bold ml-2 uppercase text-xs tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                id="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border-[3px] border-slate-700 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-rose-200 transition-all placeholder:text-slate-300"
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
                className="w-full bg-slate-50 border-[3px] border-slate-700 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-rose-200 transition-all placeholder:text-slate-300"
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
            {loading ? 'Creating Space...' : 'Start Our Journey'}
            {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 font-medium text-sm">
            Already have a space? {' '}
            <Link to="/login" className="text-slate-800 font-black underline decoration-2 decoration-rose-400 underline-offset-2 hover:text-rose-600 transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
