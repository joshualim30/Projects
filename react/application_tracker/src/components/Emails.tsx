import { useState, useEffect } from 'react';
import { Mail, Search, Filter, Inbox, ExternalLink } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { getFirebaseUser, getGoogleAccessToken } from '../lib/firebase';
import { searchGmail, constructJobSearchQuery, Email } from '../lib/gmail';
import { Application } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from './EmptyState';

export const Emails = () => {
    const [apps, setApps] = useState<Application[]>([]);
    const [selectedAppId, setSelectedAppId] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(getFirebaseUser());
    const [emails, setEmails] = useState<Email[]>([]);
    const [fetchingEmails, setFetchingEmails] = useState(false);

    useEffect(() => {
        const fetchApps = async () => {
            const client = await getSupabaseClient();
            if (!client) {
                setLoading(false);
                return;
            }
            const { data } = await client.from('applications').select('*').order('company_name');
            if (data) setApps(data);
            setLoading(false);
        };
        fetchApps();
        setUser(getFirebaseUser());

        window.addEventListener('config-updated', fetchApps);
        return () => window.removeEventListener('config-updated', fetchApps);
    }, []);

    useEffect(() => {
        const loadEmails = async () => {
            if (!user) return;
            if (!getGoogleAccessToken()) {
                console.warn("No Google Access Token. User needs to sign in again to grant Gmail access.");
                return;
            }

            setFetchingEmails(true);
            try {
                const selectedAppName = selectedAppId !== 'all'
                    ? apps.find(a => a.id.toString() === selectedAppId)?.company_name
                    : undefined;

                const query = constructJobSearchQuery(selectedAppName, search ? [search] : undefined);
                const results = await searchGmail(query);
                setEmails(results);
            } catch (err) {
                console.error("Failed to fetch emails", err);
            } finally {
                setFetchingEmails(false);
            }
        };

        loadEmails();
    }, [user, selectedAppId, apps, search]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-indigo-500/10" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 px-4 md:px-8 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">Email Assistant</h2>
                    <p className="text-slate-400 font-medium text-lg">Track communications for your applications.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search emails..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-4 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 min-w-[240px] shadow-inner focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all">
                    <Filter className="w-5 h-5 text-slate-500" />
                    <select
                        value={selectedAppId}
                        onChange={(e) => setSelectedAppId(e.target.value)}
                        className="bg-transparent text-slate-300 text-sm font-bold focus:outline-none cursor-pointer w-full appearance-none"
                    >
                        <option value="all">All Applications</option>
                        {apps.map(app => (
                            <option key={app.id} value={app.id.toString()}>{app.company_name} - {app.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {fetchingEmails ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : emails.length > 0 ? (
                <div className="grid gap-4">
                    {emails.map(email => (
                        <motion.div
                            key={email.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors line-clamp-1">{email.subject}</h3>
                                <span className="text-xs text-slate-500 font-mono whitespace-nowrap ml-4">{new Date(email.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-400 font-medium mb-3">{email.from.replace(/<.*>/, '').trim()}</p>
                            <p className="text-sm text-slate-500 line-clamp-2">{email.snippet}</p>
                        </motion.div>
                    ))}
                </div>
            ) : !user ? (
                <EmptyState
                    icon={Inbox}
                    title="No Gmail Link"
                    description="Connect your Gmail account by signing in with Google in the sidebar to automatically fetch and filter communications."
                    actionLabel="Go to Settings"
                    onAction={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'settings' }))}
                    className="min-h-[500px] bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-xl shadow-black/20"
                />
            ) : (
                <EmptyState
                    icon={Mail}
                    title="No Emails Found"
                    description={selectedAppId === 'all'
                        ? "We couldn't find any job-related emails in your inbox. Try adding more applications to narrow your search."
                        : `No emails found for ${apps.find(a => a.id.toString() === selectedAppId)?.company_name}.`
                    }
                    className="min-h-[500px] bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-xl shadow-black/20"
                />
            )}

            <AnimatePresence>
                {selectedAppId !== 'all' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                <Mail className="w-4 h-4 text-indigo-400" />
                            </div>
                            <p className="text-sm text-indigo-200 font-medium">
                                Filtering for <span className="font-bold text-white">{apps.find(a => a.id.toString() === selectedAppId)?.company_name}</span>
                            </p>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 bg-indigo-500/10 px-3 py-2 rounded-lg hover:bg-indigo-500/20">
                            Manual Search
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
