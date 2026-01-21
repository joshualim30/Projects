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
        try {
            // Save to local storage for immediate AI access
            localStorage.setItem('user_profile_context', JSON.stringify(profile));

            const user = getFirebaseUser();
            const client = await getSupabaseClient();

            if (!user) {
                alert('Saved to local storage only (not logged in). Please sign in to sync with the cloud.');
                setLoading(false);
                return;
            }

            if (client) {
                const { error } = await client.from('user_profiles').upsert({
                    user_id: user.uid,
                    ...profile,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

                if (error) throw error;

                alert('Profile saved successfully!');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 px-4 md:px-8 pt-4">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-2 shadow-sm backdrop-blur-md">
                        <User className="w-3 h-3" />
                        My Profile
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter glow-text">Profile Context</h2>
                    <p className="text-slate-400 font-medium text-lg max-w-2xl">
                        Teach the AI about you to generate <span className="text-indigo-400 font-bold">personalized</span> content.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Input Area */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-3xl p-8 relative overflow-hidden group"
                    >
                        {/* Decorative background gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                                <User className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Professional Bio</h3>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">For "About Me" sections</p>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                rows={6}
                                placeholder="I am a Senior Software Engineer with 5 years of experience specializing in React and Node.js..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none text-sm font-medium leading-relaxed backdrop-blur-sm shadow-inner"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-3xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                <Award className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Key Achievements</h3>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">Impact metrics & wins</p>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <textarea
                                value={profile.key_achievements}
                                onChange={(e) => setProfile({ ...profile, key_achievements: e.target.value })}
                                rows={6}
                                placeholder="- Led a team of 5 engineers to deliver..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none text-sm font-medium leading-relaxed backdrop-blur-sm shadow-inner"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Context */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-linear-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="flex items-center gap-2 mb-3 text-indigo-300 relative z-10">
                            <Sparkles className="w-5 h-5" />
                            <h4 className="font-black uppercase tracking-widest text-[11px]">Pro Tip</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium relative z-10">
                            The more specific you are here, the less "AI-sounding" your cover letters will be. Mention specific metrics (e.g., "reduced latency by 20%") and distinct technologies you love using.
                        </p>
                    </motion.div>

                    <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-lg shadow-rose-500/10">
                                <BookOpen className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Experience</h3>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">Career Timeline</p>
                            </div>
                        </div>
                        <textarea
                            value={profile.experience_summary}
                            onChange={(e) => setProfile({ ...profile, experience_summary: e.target.value })}
                            rows={8}
                            placeholder="Worked at TechCorp (2020-2023) focusing on..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all resize-none text-sm font-medium leading-relaxed backdrop-blur-sm shadow-inner"
                        />
                    </div>

                    <div className="sticky bottom-6">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="group w-full py-4 bg-white hover:bg-slate-200 text-black font-black rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.2)] active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                            Save Context
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
