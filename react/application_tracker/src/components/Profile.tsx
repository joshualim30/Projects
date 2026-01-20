import { useState, useEffect } from 'react';
import { User, Save, RefreshCw, Award, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSupabaseClient } from '../lib/supabase';
import { getFirebaseUser } from '../lib/firebase';

export interface UserProfile {
    bio: string;
    experience_summary: string;
    key_achievements: string;
    skills: string;
}

export const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        bio: '',
        experience_summary: '',
        key_achievements: '',
        skills: ''
    });

    useEffect(() => {
        // 1. Load from LocalStorage (fastest)
        const savedProfile = localStorage.getItem('user_profile_context');
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }

        // 2. Fetch from Supabase (source of truth)
        const fetchRemoteProfile = async () => {
            const user = getFirebaseUser();
            const client = await getSupabaseClient();
            if (user && client) {
                const { data, error } = await client
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', user.uid)
                    .single();

                if (data && !error) {
                    setProfile(prev => {
                        const merged = { ...prev, ...data };
                        localStorage.setItem('user_profile_context', JSON.stringify(merged));
                        return merged;
                    });
                }
            }
        };

        fetchRemoteProfile();

        window.addEventListener('config-updated', fetchRemoteProfile);
        return () => window.removeEventListener('config-updated', fetchRemoteProfile);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        // Save to local storage for immediate AI access
        localStorage.setItem('user_profile_context', JSON.stringify(profile));

        // Save to Supabase
        const user = getFirebaseUser();
        const client = await getSupabaseClient();

        if (user && client) {
            const { error } = await client.from('user_profiles').upsert({
                user_id: user.uid,
                ...profile,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

            if (error) {
                console.error('Supabase save error:', error);
                alert('Saved to local storage, but failed to sync with Cloud: ' + error.message);
            }
        }

        // Simulate network delay for UX if local only
        if (!user || !client) {
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        setLoading(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 px-4 md:px-8 pt-4">
            <header className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">My Profile</h2>
                <p className="text-slate-400 font-medium text-lg">
                    Teach the AI about you. This context is used to write <span className="text-indigo-400 font-bold">hyper-personalized</span> cover letters.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Input Area */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/20"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <User className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Professional Bio</h3>
                        </div>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={6}
                            placeholder="I am a Senior Software Engineer with 5 years of experience specializing in React and Node.js..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none text-sm font-medium leading-relaxed"
                        />
                        <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wide">
                            Used for the "About Me" section of cover letters.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/20"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Award className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Key Achievements</h3>
                        </div>
                        <textarea
                            value={profile.key_achievements}
                            onChange={(e) => setProfile({ ...profile, key_achievements: e.target.value })}
                            rows={6}
                            placeholder="- Led a team of 5 engineers to deliver..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all resize-none text-sm font-medium leading-relaxed"
                        />
                        <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wide">
                            Bullet points that prove your impact. The AI will weave these into relevant paragraphs.
                        </p>
                    </motion.div>
                </div>

                {/* Sidebar Context */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl"
                    >
                        <div className="flex items-center gap-2 mb-4 text-amber-400">
                            <Sparkles className="w-5 h-5" />
                            <h4 className="font-bold uppercase tracking-widest text-xs">AI Tip</h4>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            The more specific you are here, the less "AI-sounding" your cover letters will be. Mention specific metrics (e.g., "reduced latency by 20%") and distinct technologies you love using.
                        </p>
                    </motion.div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                                <BookOpen className="w-5 h-5 text-rose-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Experience Summary</h3>
                        </div>
                        <textarea
                            value={profile.experience_summary}
                            onChange={(e) => setProfile({ ...profile, experience_summary: e.target.value })}
                            rows={8}
                            placeholder="Worked at TechCorp (2020-2023) focusing on..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 transition-all resize-none text-sm font-medium leading-relaxed"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-4 bg-white hover:bg-slate-200 text-black font-black rounded-2xl shadow-xl shadow-white/5 active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Profile Context
                    </button>
                </div>
            </div>
        </div>
    );
};
