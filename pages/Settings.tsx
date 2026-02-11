
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Moon, Shield } from 'lucide-react';

import { AppState } from '../types';

interface SettingsProps {
  state: AppState;
  onUpdate: (updates: Partial<AppState>) => void;
  onReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ state, onUpdate, onReset }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="text-slate-700" />
        </button>
        <h2 className="text-3xl font-black italic uppercase text-slate-700">Settings</h2>
      </div>

      <div className="space-y-4">
        <SettingToggle icon={<Bell />} label="Daily Reminders" defaultChecked />
        
        <div className="flex items-center justify-between p-5 bg-white border-[3px] border-slate-700 rounded-[2rem] shadow-[4px_4px_0px_0px_#334155] opacity-60 cursor-not-allowed">
          <div className="flex items-center gap-4">
            <div className="text-slate-700 relative">
              <Moon />
            </div>
            <span className="font-bold text-slate-700">Night Romance Mode</span>
          </div>
          <span className="bg-rose-400 text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-slate-700 transform rotate-12 shadow-sm">
            Soon!
          </span>
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={onReset}
          className="w-full bg-red-50 border-[3px] border-red-200 text-red-400 font-black uppercase tracking-widest py-4 rounded-[1.5rem] flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
        >
          <Shield size={20} />
          Reset App Data
        </button>
      </div>

      <div className="pt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Memory Lane v2.0.0
      </div>
    </div>
  );
};

interface ToggleProps {
  icon: React.ReactNode;
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: () => void;
}

const SettingToggle: React.FC<ToggleProps> = ({ icon, label, defaultChecked, checked, onChange }) => (
  <div className="flex items-center justify-between p-5 bg-white border-[3px] border-slate-700 rounded-[2rem] shadow-[4px_4px_0px_0px_#334155] hover:scale-[1.02] transition-transform active:scale-95">
    <div className="flex items-center gap-4">
      <div className="text-slate-700">{icon}</div>
      <span className="font-bold text-slate-700">{label}</span>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-400"></div>
    </label>
  </div>
);

export default Settings;
