
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Settings as SettingsIcon, LogOut, Camera, Calendar, Mail } from 'lucide-react';
import { AppState } from '../types';

import { supabase } from '../services/supabase';

interface ProfileProps {
  state: AppState;
  onUpdate?: (updates: Partial<AppState>) => void;
}

const Profile: React.FC<ProfileProps> = ({ state, onUpdate }) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = React.useState(false);
  const [editingDate, setEditingDate] = React.useState(false);
  const [tempDate, setTempDate] = React.useState(state.startDate);
  const [showSuccess, setShowSuccess] = React.useState('');

  const showNotification = (msg: string) => {
    setShowSuccess(msg);
    setTimeout(() => setShowSuccess(''), 3000);
  };

  const handleDateUpdate = async (newDate: string) => {
    try {
      // Update Local State immediately for responsiveness
      if (onUpdate) {
        onUpdate({ startDate: newDate });
      }

      // Update Database
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log("Saving date:", newDate, "for user:", session?.user?.id);

      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .update({ start_date: newDate })
          .eq('id', session.user.id)
          .select(); // Ask for the updated row back to confirm

        if (error) {
          console.error("Supabase Update Error:", error);
          throw error;
        }

        if (data && data.length > 0) {
          showNotification('Anniversary Date Updated!');
        } else {
           console.warn("Update succeeded but returned 0 rows. Row might not exist or RLS blocking.");
        }
      }

    } catch (error: any) {
      console.error("Error updating date:", error);
      alert("Failed to update date. Please try again.");
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>, partner: 'partner1' | 'partner2') => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${partner}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update Database
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const updateField = partner === 'partner1' ? 'partner1_avatar' : 'partner2_avatar';
        const { error: dbError } = await supabase
          .from('profiles')
          .update({ [updateField]: publicUrl })
          .eq('id', session.user.id);

        if (dbError) throw dbError;
        showNotification(`${partner === 'partner1' ? 'Partner 1' : 'Partner 2'} Avatar Updated!`);
      }

      // Update Local State
      if (onUpdate) {
        onUpdate({ 
          [partner === 'partner1' ? 'partner1Avatar' : 'partner2Avatar']: publicUrl 
        });
      }

    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 pb-20 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mt-4 relative">
        <h2 className="text-3xl font-black italic uppercase text-slate-700">Couple Profile</h2>
        <button onClick={() => navigate('/settings')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <SettingsIcon className="text-slate-400" />
        </button>

        {showSuccess && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-in fade-in slide-in-from-top-4 z-50 whitespace-nowrap border-2 border-emerald-600">
             ✨ {showSuccess}
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="flex items-center -space-x-4">
            
            {/* Partner 1 Avatar */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-[4px] border-slate-700 bg-blue-100 overflow-hidden shadow-lg relative">
                  <img 
                    src={state.partner1Avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${state.partner1}`} 
                    alt={state.partner1} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border-2 border-slate-700 cursor-pointer shadow-sm hover:scale-110 transition-transform z-20">
                  <Camera size={14} className="text-slate-700" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleAvatarUpload(e, 'partner1')}
                    disabled={uploading}
                  />
                </label>
              </div>
              <span className="text-xs font-black uppercase text-slate-500 bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm border border-slate-200">
                {state.partner1}
              </span>
            </div>

            {/* Partner 2 Avatar */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-[4px] border-slate-700 bg-purple-100 overflow-hidden shadow-lg relative">
                  <img 
                    src={state.partner2Avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${state.partner2}`} 
                    alt={state.partner2} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border-2 border-slate-700 cursor-pointer shadow-sm hover:scale-110 transition-transform z-20">
                  <Camera size={14} className="text-slate-700" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleAvatarUpload(e, 'partner2')}
                    disabled={uploading}
                  />
                </label>
              </div>
              <span className="text-xs font-black uppercase text-slate-500 bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm border border-slate-200">
                {state.partner2}
              </span>
            </div>

          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full border-[3px] border-slate-700 shadow-md z-30">
            <Heart className="text-rose-400 fill-rose-400" size={20} />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-4xl font-black text-slate-700 italic uppercase leading-none">{state.partner1} & {state.partner2}</h3>
          <p className="text-rose-400 font-bold mt-1">
            {uploading ? 'Updating photos...' : (
              `Happily together since ${new Date(state.startDate || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
            )}
          </p>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="space-y-4">
        <div className="bg-white cartoon-card p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky rounded-2xl border-[2px] border-slate-700">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Anniversary</p>
              {editingDate ? (
                <input 
                  type="date" 
                  value={tempDate} 
                  onChange={(e) => setTempDate(e.target.value)}
                  className="font-bold text-slate-700 bg-slate-50 border-2 border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-rose-400"
                  autoFocus
                />
              ) : (
                <p className="font-bold text-slate-700" onClick={() => { setTempDate(state.startDate); setEditingDate(true); }}>
                  {new Date(state.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={() => {
              if (editingDate) {
                // Done clicked: Save
                handleDateUpdate(tempDate);
                setEditingDate(false);
              } else {
                // Edit clicked: Start editing
                setTempDate(state.startDate);
                setEditingDate(true);
              }
            }}
            className="text-xs font-black text-rose-400 uppercase hover:text-rose-600 transition-colors"
          >
            {editingDate ? 'Done' : 'Edit'}
          </button>
        </div>


      </div>

      <div className="pt-4">
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            localStorage.clear(); 
            navigate('/login');
          }}
          className="w-full bg-slate-50 border-[3px] border-slate-200 text-slate-400 font-black uppercase tracking-widest py-4 rounded-[1.5rem] flex items-center justify-center gap-2 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-400 transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
