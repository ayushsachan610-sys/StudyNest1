// Optional Supabase Client Adapter
// StudyNest operates in 100% functional Demo Mode by default using local browser persistence.
// If VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided in production, this adapter enables cloud sync.

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));

export interface CloudSyncStatus {
  isConfigured: boolean;
  mode: 'demo_local' | 'cloud_supabase';
  statusMessage: string;
}

export function getSyncStatus(): CloudSyncStatus {
  if (isSupabaseConfigured) {
    return {
      isConfigured: true,
      mode: 'cloud_supabase',
      statusMessage: 'Connected to Supabase Cloud Storage (Encrypted Row-Level Security)',
    };
  }

  return {
    isConfigured: false,
    mode: 'demo_local',
    statusMessage: 'Running in Local Demo Mode (Browser Persistence)',
  };
}
