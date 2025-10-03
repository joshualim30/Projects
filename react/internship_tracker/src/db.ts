// db.ts
// Database connection using Supabase

import { createClient } from '@supabase/supabase-js'
import { CredentialsService } from './services/credentialsService'

let supabase: any = null;
let isInitializing = false;

// Initialize Supabase client with credentials
export const initializeSupabase = async () => {
  try {
    // If client already exists, return it
    if (supabase) {
      return supabase;
    }
    
    // Prevent multiple simultaneous initializations
    if (isInitializing) {
      // Wait for the current initialization to complete
      while (isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      return supabase;
    }
    
    isInitializing = true;
    
    // Check if we're running in Electron (desktop app)
    const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;
    
    if (isElectron) {
      // Desktop app: Use stored credentials
      const credentials = await CredentialsService.getCredentials();
      
      if (!credentials) {
        throw new Error('No Supabase credentials found. Please configure your database connection.');
      }

      supabase = createClient(credentials.url, credentials.anonKey);
    } else {
      // Web app: Use environment variables
      const envUrl = import.meta.env.VITE_SUPABASE_URL;
      const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!envUrl || !envKey) {
        throw new Error('Missing Supabase environment variables. Please check your .env file.');
      }

      supabase = createClient(envUrl, envKey);
    }
    
    return supabase;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
};

// Get the current Supabase client
export const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase not initialized. Call initializeSupabase() first.');
  }
  return supabase;
};

// Reinitialize with new credentials
export const reinitializeSupabase = async () => {
  supabase = null;
  isInitializing = false;
  return await initializeSupabase();
};

// Export a default client for backward compatibility
export default getSupabase;