
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials missing! Please make sure you have created a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

// Fallback to prevent app crash on load, but functionality will fail if keys are missing
const url = (supabaseUrl || 'https://placeholder.supabase.co').trim();
const key = (supabaseAnonKey || 'placeholder-key').trim();

// Debugging: Log the URL to see if it's correct in browser console
console.log("Supabase URL:", url);
console.log("Supabase Key Length:", key.length);
console.log("Supabase Key Preview:", key.substring(0, 5) + "..." + key.substring(key.length - 5));

if (key.length < 10) {
  console.error("CRITICAL: Supabase Key seems too short or invalid!");
}

export const supabase = createClient(url, key);
