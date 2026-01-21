import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppStorage } from './storage';

export const getSupabaseConfig = async () => {
    const url = await AppStorage.getItem('SUPABASE_URL') || import.meta.env.VITE_SUPABASE_URL;
    const key = await AppStorage.getItem('SUPABASE_ANON_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY;
    return { url, key };
};

export const getSupabaseClient = async (url?: string, key?: string): Promise<SupabaseClient | null> => {
    const config = await getSupabaseConfig();
    const finalUrl = url || config.url;
    const finalKey = key || config.key;

    if (!finalUrl || !finalKey) {
        return null;
    }

    return createClient(finalUrl, finalKey);
};

// Deprecated: Sync version for backward compat if we have config in memory? 
// No, let's migrate to async.
export const supabase = (url?: string, key?: string) => {
    // This function was originally sync. We can't make it async without breaking signature.
    // However, we can't synchronously read from electron-store via IPC.
    // We MUST migrate callers to use getSupabaseClient.
    // For now, I'll return null if no args provided and rely on migration.
    if (url && key) return createClient(url, key);
    console.warn("supabase() called without args in sync mode. Use getSupabaseClient() instead.");
    return null;
};

export const saveSupabaseConfig = async (url: string, key: string) => {
    await AppStorage.setItem('SUPABASE_URL', url);
    await AppStorage.setItem('SUPABASE_ANON_KEY', key);
};

export const clearSupabaseConfig = async () => {
    await AppStorage.removeItem('SUPABASE_URL');
    await AppStorage.removeItem('SUPABASE_ANON_KEY');
};
