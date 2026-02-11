
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Heart, Map as MapIcon, Calendar, PlusCircle, User, Award } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import Timeline from './pages/Timeline';
import AddMemory from './pages/AddMemory';
import MemoryDetail from './pages/MemoryDetail';
import Onboarding from './pages/Onboarding';
import PartnerConnect from './pages/PartnerConnect';
import Milestones from './pages/Milestones';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import Splash from './pages/Splash';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { AppState, Memory } from './types';
import { supabase } from './services/supabase';

const INITIAL_DATA: AppState = {
  partner1: "Ayaan",
  partner2: "Sara",
  startDate: "2023-01-14",
  memories: [
    {
      id: '1',
      title: 'Our First Meeting',
      date: '2023-01-14',
      location: { name: 'The Coffee Bean Cafe', x: 25, y: 35 },
      category: 'First Meeting' as any,
      note: 'I was so nervous I spilled my latte, but you just laughed and offered your napkin.',
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80',
      coupleNames: ['Ayaan', 'Sara']
    },
    {
      id: '2',
      title: 'Our First Trip Together',
      date: '2023-06-20',
      location: { name: 'Sunny Peak Mountains', x: 75, y: 15 },
      category: 'First Trip' as any,
      note: 'The hiking was tough, but the view at the top was worth every step. Our first sunrise!',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
      coupleNames: ['Ayaan', 'Sara']
    }
  ]
};

const AppRoutes: React.FC<{ 
  state: AppState, 
  hasCompletedOnboarding: boolean, 
  completeOnboarding: (userData?: { partner1: string, partner2: string }) => void, 
  addMemory: (m: Memory) => void,
  deleteMemory: (id: string) => void,
  updateProfile: (updates: Partial<AppState>) => void,
  resetApp: () => void
}> = ({ state, hasCompletedOnboarding, completeOnboarding, addMemory, deleteMemory, updateProfile, resetApp }) => {
  return (
    <Routes>
      <Route path="/splash" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding onComplete={completeOnboarding} />} />
      <Route path="/signup" element={<Signup onComplete={completeOnboarding} />} />
      <Route path="/login" element={<Login onComplete={completeOnboarding} />} />
      
      <Route path="/" element={!hasCompletedOnboarding ? <Navigate to="/splash" /> : <Dashboard state={state} />} />
      
      <Route path="/partner-connect" element={<PartnerConnect />} />
      <Route path="/map" element={<MapPage memories={state.memories} />} />
      <Route path="/timeline" element={<Timeline memories={state.memories} />} />
      <Route path="/add" element={<AddMemory onAdd={addMemory} />} />
      <Route path="/memory/:id" element={<MemoryDetail memories={state.memories} onDelete={deleteMemory} />} />
      <Route path="/milestones" element={<Milestones state={state} />} />
      <Route path="/profile" element={<Profile state={state} onUpdate={updateProfile} />} />
      <Route path="/settings" element={<SettingsPage state={state} onUpdate={updateProfile} onReset={resetApp} />} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// ... (keep props interfaces and other components if not changed)

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('memory_lane_v2_state');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [loading, setLoading] = useState(true);

  // Load initial data from Supabase or LocalStorage (for offline/demo)
  useEffect(() => {
    const loadData = async () => {
      // Check auth session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Load Profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setState(prev => ({
            ...prev,
            partner1: profile.partner1_name || prev.partner1,
            partner2: profile.partner2_name || prev.partner2,
            partner1Avatar: profile.partner1_avatar,
            partner2Avatar: profile.partner2_avatar,
            startDate: profile.start_date || prev.startDate
          }));
        }

        // Load Memories
        const { data: memories } = await supabase
          .from('memories')
          .select('*')
          .eq('user_id', session.user.id) // Ensure we only get this user's memories
          .order('date', { ascending: false });

        if (memories) {
           // map database fields to app types if necessary (snake_case to camelCase)
           const mappedMemories: Memory[] = memories.map((m: any) => ({
             id: m.id,
             title: m.title,
             date: m.date,
             location: { name: m.location_name, x: m.location_x, y: m.location_y },
             category: m.category,
             note: m.note,
             imageUrl: m.image_url,
             coupleNames: [profile?.partner1_name || 'Partner 1', profile?.partner2_name || 'Partner 2']
           }));
           
           setState(prev => ({ ...prev, memories: mappedMemories }));
        }
        
        // If logged in, we assume onboarding is done
        setHasCompletedOnboarding(true);
      } else {
        // Fallback to local storage for non-logged in users (or keep existing logic)
        const saved = localStorage.getItem('memory_lane_v2_state');
        if (saved) setState(JSON.parse(saved));
      }
      setLoading(false);
    };

    loadData();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
         // Reload data
         loadData();
      } else if (event === 'SIGNED_OUT') {
         setHasCompletedOnboarding(false);
         setState(INITIAL_DATA);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('onboarding_done') === 'true';
  });

  // Sync state to local storage as backup (optional, maybe remove if strictly cloud)
  // Sync state to local storage as backup (optional, maybe remove if strictly cloud)
  useEffect(() => {
    if (loading) return;
    localStorage.setItem('memory_lane_v2_state', JSON.stringify(state));
  }, [state, loading]);

  useEffect(() => {
    if (state.isNightMode) {
      document.body.classList.add('night-romance');
    } else {
      document.body.classList.remove('night-romance');
    }
  }, [state.isNightMode]);

  const addMemory = async (memory: Memory) => {
    // Optimistic update
    setState(prev => ({
      ...prev,
      memories: [memory, ...prev.memories]
    }));
    
    // Save to Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase.from('memories').insert([{
        user_id: session.user.id,
        title: memory.title,
        date: memory.date,
        location_name: memory.location.name,
        location_x: memory.location.x,
        location_y: memory.location.y,
        category: memory.category,
        note: memory.note,
        image_url: memory.imageUrl
      }])
      .select()
      .single();

      if (data) {
        // Critical: Update the local memory with the real UUID from DB 
        // This ensures the ID matches when we try to delete it later!
        setState(prev => ({
          ...prev,
          memories: prev.memories.map(m => m.id === memory.id ? { ...m, id: data.id } : m).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }));
      }

      if (error) {
        console.error("Error saving memory:", error);
      }
    }
  };

  /* New: Delete Memory Function */
  const deleteMemory = async (memoryId: string) => {
    // Optimistic Update
    setState(prev => ({
      ...prev,
      memories: prev.memories.filter(m => m.id !== memoryId)
    }));

    // Update Database
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', memoryId);

    if (error) {
      console.error("Error deleting memory:", error);
      alert("Failed to delete memory from cloud.");
    }
  };

  const completeOnboarding = (userData?: { partner1: string, partner2: string }) => {
    if (userData) {
      setState(prev => ({
        ...prev,
        partner1: userData.partner1,
        partner2: userData.partner2
      }));
    }
    setHasCompletedOnboarding(true);
    localStorage.setItem('onboarding_done', 'true');
    localStorage.setItem('has_account', 'true');
  };



  const updateProfile = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetApp = async () => {
    if(window.confirm('Are you sure you want to reset the app? All data will be lost forever!')) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Delete all memories
        await supabase
          .from('memories')
          .delete()
          .eq('user_id', session.user.id);
        
        // Reset profile defaults (optional, but good for full reset)
        await supabase
          .from('profiles')
          .update({ 
            partner1_name: null, 
            partner2_name: null, 
            start_date: new Date().toISOString() 
          })
          .eq('id', session.user.id);
      }

      localStorage.clear();
      window.location.reload();
    }
  };

  if (loading) return <div className="h-screen bg-blush flex items-center justify-center text-white font-bold text-xl">Loading Love Story...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-[#FFF8F0] pb-28">
      <AppRoutes 
        state={state} 
        hasCompletedOnboarding={hasCompletedOnboarding} 
        completeOnboarding={completeOnboarding}
        addMemory={addMemory}
        deleteMemory={deleteMemory} 
        updateProfile={updateProfile}
        resetApp={resetApp}
      />
        <BottomNavContainer hasCompletedOnboarding={hasCompletedOnboarding} />
      </div>
    </Router>
  );
};

const BottomNavContainer: React.FC<{ hasCompletedOnboarding: boolean }> = ({ hasCompletedOnboarding }) => {
  const location = useLocation();
  const hidePaths = ['/splash', '/onboarding', '/signup', '/login'];
  if (!hasCompletedOnboarding || hidePaths.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white border-[3px] border-slate-700 rounded-[2.5rem] shadow-[0px_8px_0px_0px_rgba(51,51,51,0.1)] flex items-center justify-around py-4 px-2 z-50">
      <NavLink to="/" icon={<Heart size={24} />} label="Home" />
      <div className="flex flex-col items-center relative opacity-50 cursor-not-allowed group">
        <MapIcon size={24} className="text-slate-400 group-hover:text-slate-500 transition-colors" />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-widest text-slate-400">Map</span>
        <span className="absolute -top-3 -right-2 bg-rose-400 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full rotate-12 shadow-sm border border-slate-700">SOON</span>
      </div>
      <Link to="/add" className="bg-blush border-[3px] border-slate-700 p-3 rounded-full -mt-10 shadow-[0px_4px_0px_0px_#334155] active:translate-y-1 active:shadow-none transition-all">
        <PlusCircle size={32} className="text-slate-700" />
      </Link>
      <NavLink to="/timeline" icon={<Calendar size={24} />} label="Time" />
      <NavLink to="/profile" icon={<User size={24} />} label="Us" />
    </nav>
  );
};

const NavLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={`flex flex-col items-center transition-all ${isActive ? 'text-[#FF7FA9] scale-110' : 'text-slate-400'}`}>
      {icon}
      <span className="text-[10px] font-bold mt-1 uppercase tracking-widest">{label}</span>
    </Link>
  );
};

export default App;
