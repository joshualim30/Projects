import { useState, useEffect } from 'react';
import { Mail, Search, Filter, Inbox, ExternalLink, RefreshCw, X } from 'lucide-react';
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
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

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
                let query = '';
                if (selectedAppId === 'all') {
                    // Default query or search across all
                    // maybe construct a broad query or just search keywords
                    query = constructJobSearchQuery(undefined, search ? [search] : undefined);
                } else {
                    const selectedAppName = selectedAppId !== 'all'
                        ? apps.find(a => a.id.toString() === selectedAppId)?.company_name
                        : undefined;

                    query = constructJobSearchQuery(selectedAppName, search ? [search] : undefined);
                }

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
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-indigo-500/10" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 px-4 md:px-8 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-2 shadow-sm backdrop-blur-md"
                    >
                        <Mail className="w-3 h-3" />
                        Communications
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 glow-text">Email Assistant</h2>
                    <p className="text-slate-400 font-medium text-lg">Track communications for your applications.</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col md:flex-row gap-4 relative z-10"
            >
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search emails..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-14 pr-4 py-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-2xl px-5 py-4 w-48 shadow-inner focus-within:ring-1 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all backdrop-blur-sm">
                    <Filter className="w-5 h-5 text-slate-500" />
                    <select
                        value={selectedAppId}
                        onChange={(e) => setSelectedAppId(e.target.value)}
                        className="bg-transparent text-slate-300 text-sm font-bold focus:outline-none cursor-pointer w-full appearance-none"
                    >
                        <option value="all">Inbox</option>

                        {apps.map(app => (
                            <option key={app.id} value={app.id.toString()}>{app.company_name} - {app.title}</option>
                        ))}
                    </select>
                </div>
            </motion.div>

            {fetchingEmails ? (
                <div className="flex justify-center p-24">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-indigo-500 animate-pulse" />
                        </div>
                    </div>
                </div>
            ) : emails.length > 0 ? (
                <div className="grid gap-4">
                    {emails.map((email, idx) => (
                        <motion.div
                            key={email.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card rounded-2xl p-6 hover:border-indigo-500/30 transition-all group cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div
                                onClick={() => setSelectedEmail(email)}
                                className="flex justify-between items-start mb-2 relative z-10"
                            >
                                <h3 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors line-clamp-1">{email.subject}</h3>
                                <span className="text-xs text-slate-500 font-mono whitespace-nowrap ml-4 bg-black/20 px-2 py-1 rounded-lg border border-white/5">{new Date(email.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-indigo-200 font-medium mb-3 relative z-10 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                {email.from.replace(/<.*>/, '').trim()}
                            </p>
                            <p className="text-sm text-slate-400 line-clamp-2 relative z-10 leading-relaxed max-w-4xl">{email.snippet}</p>
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
                    className="min-h-[500px] glass-card rounded-[2.5rem]"
                />
            ) : (
                <EmptyState
                    icon={Mail}
                    title="No Emails Found"
                    description={selectedAppId === 'all'
                        ? "We couldn't find any job-related emails in your inbox. Try adding more applications to narrow your search."
                        : `No emails found for ${apps.find(a => a.id.toString() === selectedAppId)?.company_name}.`
                    }
                    className="min-h-[500px] glass-card rounded-[2.5rem]"
                />
            )}

            <AnimatePresence>
                {selectedAppId !== 'all' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                                <Mail className="w-4 h-4 text-indigo-400" />
                            </div>
                            <p className="text-sm text-indigo-200 font-medium">
                                Filtering for <span className="font-bold text-white shadow-sm">
                                    {apps.find(a => a.id.toString() === selectedAppId)?.company_name}
                                </span>
                            </p>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 bg-indigo-500/10 px-3 py-2 rounded-lg hover:bg-indigo-500/20 border border-indigo-500/10">
                            Manual Search
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Email Detail Modal */}
            <AnimatePresence>
                {selectedEmail && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEmail(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-[95vw] h-[90vh] flex flex-col glass-card rounded-3xl overflow-hidden shadow-2xl relative z-10"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-20 flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2">{selectedEmail.subject}</h3>
                                    <div className="flex flex-wrap items-center gap-3 text-sm">
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                            <span className="font-medium">{selectedEmail.from.replace(/<.*>/, '').trim()}</span>
                                        </div>
                                        <span className="text-slate-500 font-mono text-xs">{new Date(selectedEmail.date).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedEmail(null)}
                                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-hidden bg-white/95 relative">
                                {selectedEmail.html ? (
                                    <iframe
                                        title="Email Content"
                                        srcDoc={selectedEmail.html}
                                        className="w-full h-full border-0"
                                        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                                    />
                                ) : (
                                    <div className="overflow-y-auto p-8 h-full">
                                        <div className="whitespace-pre-wrap font-sans text-slate-900 leading-relaxed text-sm">
                                            {selectedEmail.body || selectedEmail.snippet}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                                <a
                                    href={`https://mail.google.com/mail/u/0/#inbox/${selectedEmail.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-sm font-bold transition-all flex items-center gap-2"
                                >
                                    Open in Gmail <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
