
// CoachPortal.tsx
import { useState, useEffect } from 'react';
import { Button, Spinner } from '@nextui-org/react';
import { getAuth, GoogleAuthProvider, signInWithPopup, User, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import TrainingDashboard from './TrainingDashboard';
import { Lock } from 'lucide-react';

const CoachPortal = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize DB side effect
        console.log("Firebase DB initialized:", db);

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                if (currentUser.email?.endsWith('@wavebasketball.net')) {
                    // Sync to Firestore
                    const userRef = doc(db, 'coaches', currentUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (!userSnap.exists()) {
                        await setDoc(userRef, {
                            email: currentUser.email,
                            role: 'coach',
                            createdAt: serverTimestamp(),
                            lastLogin: serverTimestamp(),
                            displayName: currentUser.displayName || '',
                            photoURL: currentUser.photoURL || ''
                        });
                    } else {
                        await setDoc(userRef, {
                            lastLogin: serverTimestamp()
                        }, { merge: true });
                    }
                    setUser(currentUser);
                } else {
                    await signOut(auth);
                    setError('Access Restricted: @wavebasketball.net email required.');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleSignIn = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            setError('');
            await signInWithPopup(auth, provider);
            // The onAuthStateChanged listener handles the validation
        } catch (err) {
            console.error(err);
            setError('Failed to sign in. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    return (
        <div className='min-h-screen text-white selection:bg-primary selection:text-white'>
            {!user ? (
                <div className='flex flex-col items-center justify-center h-[90vh] gap-8 px-4'>
                    <div className="p-4 bg-zinc-900/50 rounded-full border border-white/10 mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>

                    <div className="text-center space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Coach Portal</h1>
                        <p className="text-gray-400 text-lg">Restricted access for Wave Basketball staff.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        size="lg"
                        color="primary"
                        onClick={handleGoogleSignIn}
                        className="font-bold px-8 shadow-lg shadow-primary/20"
                    >
                        Sign in with Google
                    </Button>
                </div>
            ) : (
                <TrainingDashboard />
            )}
        </div>
    );
}

export default CoachPortal;