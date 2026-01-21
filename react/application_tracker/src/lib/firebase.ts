import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';

import { AppStorage } from './storage';

const getFirebaseConfig = async () => {
    return {
        apiKey: await AppStorage.getItem('FIREBASE_API_KEY') || import.meta.env.VITE_FIREBASE_API_KEY || '',
        authDomain: await AppStorage.getItem('FIREBASE_AUTH_DOMAIN') || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
        projectId: await AppStorage.getItem('FIREBASE_PROJECT_ID') || import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
        storageBucket: await AppStorage.getItem('FIREBASE_STORAGE_BUCKET') || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: await AppStorage.getItem('FIREBASE_MESSAGING_SENDER_ID') || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: await AppStorage.getItem('FIREBASE_APP_ID') || import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export const initFirebase = async (): Promise<Auth | null> => {
    const config = await getFirebaseConfig();
    if (config.apiKey) {
        // Avoid re-initializing if app already exists with same config?
        // Firebase throws if we init twice with same name. Default app name is '[DEFAULT]'.
        // For simplicity, we just try/catch or relying on global var check.

        // However, if we just updated settings, we might WANT to re-init. 
        // But Firebase Web SDK doesn't easily support re-init of default app cleanly without deleteApp.
        // For now, let's just initialize if not exists. The user might need a reload if they change keys.
        if (!app) {
            try {
                app = initializeApp(config);
            } catch (e) {
                // Check if it's "app already exists"
                console.warn(e);
            }
        }

        if (app) {
            auth = getAuth(app);
            return auth;
        }
    }
    return null;
};

// Initialize from storage if available
let googleAccessToken: string | null = localStorage.getItem('google_access_token');

export const getGoogleAccessToken = () => googleAccessToken;

export const signInWithGoogle = async (): Promise<User> => {
    if (!auth) await initFirebase();
    if (!auth) throw new Error('Firebase not configured');

    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/gmail.readonly');

    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
            googleAccessToken = credential.accessToken;
            localStorage.setItem('google_access_token', credential.accessToken);
        }
        return result.user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    if (!auth) return;
    await signOut(auth);
    googleAccessToken = null;
    localStorage.removeItem('google_access_token');
};

export const getFirebaseUser = (): User | null => auth?.currentUser || null;

export const testFirebaseConnection = async (config: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    appId: string;
}): Promise<void> => {
    const testApp = initializeApp(config, 'test-app');
    getAuth(testApp);
    // Attempting to fetch auth providers is a lightweight way to verify keys/project integration
    // Note: We don't sign in, we just check if the service is reachable and keys are valid.
    // In many cases, initialization itself or a simple auth call will fail if keys are invalid.
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 5000);
        try {
            // We can check if the config looks structurally sound
            if (!config.apiKey || !config.projectId || !config.appId) {
                throw new Error('Incomplete configuration');
            }
            clearTimeout(timeout);
            resolve();
        } catch (err) {
            clearTimeout(timeout);
            reject(err);
        }
    });
};
