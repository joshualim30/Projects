export interface SupabaseCredentials {
  url: string;
  anonKey: string;
}

export class CredentialsService {
  private static readonly STORAGE_KEY = 'supabase_credentials';

  static async getCredentials(): Promise<SupabaseCredentials | null> {
    try {
      // First try to get from environment variables
      const envUrl = import.meta.env.VITE_SUPABASE_URL;
      const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (envUrl && envKey) {
        return { url: envUrl, anonKey: envKey };
      }

      // If not in env, try local storage
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const credentials = JSON.parse(stored) as SupabaseCredentials;
        if (this.validateCredentials(credentials)) {
          return credentials;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting credentials:', error);
      return null;
    }
  }

  static async saveCredentials(credentials: SupabaseCredentials): Promise<boolean> {
    try {
      if (!this.validateCredentials(credentials)) {
        throw new Error('Invalid credentials format');
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(credentials));
      return true;
    } catch (error) {
      console.error('Error saving credentials:', error);
      return false;
    }
  }

  static async clearCredentials(): Promise<boolean> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing credentials:', error);
      return false;
    }
  }

  static validateCredentials(credentials: SupabaseCredentials): boolean {
    if (!credentials.url || !credentials.anonKey) {
      return false;
    }

    // Basic URL validation
    try {
      new URL(credentials.url);
    } catch {
      return false;
    }

    // Basic key validation (should be a long string)
    if (credentials.anonKey.length < 50) {
      return false;
    }

    return true;
  }

  static async testConnection(credentials: SupabaseCredentials): Promise<boolean> {
    try {
      // Use fetch directly to test the connection without creating a Supabase client
      const response = await fetch(`${credentials.url}/rest/v1/internships?select=count&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': credentials.anonKey,
          'Authorization': `Bearer ${credentials.anonKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      // If we get a 401 or 403, it means the credentials are wrong
      // If we get a 404, it means the table doesn't exist but connection works
      // If we get a 200, connection is good
      return response.status === 200 || response.status === 404;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}
