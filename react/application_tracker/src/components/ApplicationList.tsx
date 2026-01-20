import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Edit2, ExternalLink, MapPin, Building2, Calendar, Briefcase, Unplug, Users, DollarSign, Clock } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { AppStorage } from '../lib/storage';
import { Application, ApplicationStatus } from '../types';
import { cn } from '../lib/utils';
import { AddApplicationModal } from './AddApplicationModal';
import { EmptyState } from './EmptyState';

export const ApplicationList = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<ApplicationStatus | 'All'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<Application | null>(null);
    const [viewMode, setViewMode] = useState<'all' | 'interviews'>('all');
    const [hasConfig, setHasConfig] = useState<boolean>(false);

    const fetchApps = useCallback(async () => {
        setLoading(true);
        const client = await getSupabaseClient();
        if (!client) {
            setLoading(false);
            return;
        }
        const { data } = await client.from('applications').select('*').order('created_at', { ascending: false });
        if (data) setApplications(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        const checkConfig = async () => {
            const url = await AppStorage.getItem('SUPABASE_URL');
            setHasConfig(!!url);
            if (!!url) fetchApps();
            else setLoading(false);
        };

        checkConfig();
        window.addEventListener('config-updated', checkConfig);
        return () => window.removeEventListener('config-updated', checkConfig);
    }, [fetchApps]);

    useEffect(() => {
        const handleTrackJob = (e: CustomEvent<Partial<Application>>) => {
            console.log('ApplicationList: trackJob received', e.detail);
            setEditingApp(e.detail as Application);
            setIsModalOpen(true);
        };
        window.addEventListener('trackJob', handleTrackJob as EventListener);
        return () => window.removeEventListener('trackJob', handleTrackJob as EventListener);
    }, []);

    const filteredApps = applications.filter(app => {
        const matchesSearch = app.company_name.toLowerCase().includes(search.toLowerCase()) ||
            app.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || app.status === filter;
        const matchesView = viewMode === 'all' || ['interview_scheduled', 'interview_completed'].includes(app.status);
        return matchesSearch && matchesFilter && matchesView;
    });

    const statusColors: Record<ApplicationStatus, string> = {
        'applied': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'interview_scheduled': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'interview_completed': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        'offer_received': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'offer_accepted': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        'offer_declined': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        'rejected': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        'withdrawn': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    };

    const handleEdit = (app: Application) => {
        setEditingApp(app);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingApp(null);
        setIsModalOpen(true);
    };

    const statusLabels: Record<ApplicationStatus, string> = {
        'applied': 'Applied',
        'interview_scheduled': 'Interview Scheduled',
        'interview_completed': 'Interview Completed',
        'offer_received': 'Offer Received',
        'offer_accepted': 'Offer Accepted',
        'offer_declined': 'Offer Declined',
        'rejected': 'Rejected',
        'withdrawn': 'Withdrawn',
    };

    if (!hasConfig) {
        return (
            <EmptyState
                icon={Unplug}
                iconColor="text-indigo-400"
                title="Cloud Sync Disabled"
                description="Your application list requires a Supabase connection to store and sync your data. Head to settings to get started."
                actionLabel="Configure Backend"
                onAction={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'settings' }))}
            />
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-12 px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
                <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Applications</h2>
                    <p className="text-slate-400 font-medium text-lg">Manage and track your active opportunities.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner">
                        <button
                            onClick={() => setViewMode('all')}
                            className={cn(
                                "px-5 py-2.5 rounded-xl text-xs font-bold transition-all",
                                viewMode === 'all' ? "bg-slate-800 text-white shadow-lg border border-slate-700" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            All Apps
                        </button>
                        <button
                            onClick={() => setViewMode('interviews')}
                            className={cn(
                                "px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                                viewMode === 'interviews' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Clock className="w-3.5 h-3.5" />
                            Interviews
                        </button>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-white text-black hover:bg-slate-200 px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-white/5 active:scale-95 transition-all text-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Application
                    </button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-800/50 rounded-lg">
                        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search company or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                    />
                </div>
                <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 min-w-[200px] relative hover:border-slate-700 transition-colors">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as ApplicationStatus | 'All')}
                        className="bg-transparent text-slate-300 text-sm font-bold focus:outline-none cursor-pointer w-full appearance-none pr-8"
                    >
                        <option value="All">All Statuses</option>
                        <option value="applied">Applied</option>
                        <option value="interview_scheduled">Interview Scheduled</option>
                        <option value="interview_completed">Interview Completed</option>
                        <option value="offer_received">Offer Received</option>
                        <option value="offer_accepted">Offer Accepted</option>
                        <option value="offer_declined">Offer Declined</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
                <AnimatePresence mode='popLayout'>
                    {filteredApps.map((app, idx) => (
                        <motion.div
                            key={app.id}
                            layout
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 group hover:border-slate-700 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Subtle colored accent on hover */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex flex-wrap items-start justify-between gap-4 pl-2">
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner overflow-hidden shrink-0 group-hover:border-slate-700 transition-colors">
                                        {app.company_logo ? (
                                            <img src={app.company_logo} alt={app.company_name} className="w-10 h-10 object-contain" />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                                            {app.company_name}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-slate-400 mt-1.5">
                                            <span className="font-semibold text-slate-300 text-lg">{app.title}</span>
                                            {app.company_location && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {app.company_location}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                                        statusColors[app.status]
                                    )}>
                                        {statusLabels[app.status]}
                                    </span>
                                    <button
                                        onClick={() => handleEdit(app)}
                                        className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-800/50 flex flex-wrap items-center justify-between gap-4 pl-2">
                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(app.application_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    {app.contact_person && (
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                            <Users className="w-3.5 h-3.5" />
                                            {app.contact_person}
                                        </div>
                                    )}
                                    {app.salary_range && (
                                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            {app.salary_range}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    {app.application_url && (
                                        <a
                                            href={app.application_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors hover:underline decoration-indigo-500 underline-offset-4"
                                        >
                                            View Job Post
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {!loading && filteredApps.length === 0 && (
                    <EmptyState
                        icon={Briefcase}
                        title="No applications found"
                        description="Start tracking your career journey by adding your first application above."
                        className="py-24 bg-slate-900 border border-slate-800 rounded-[2.5rem]"
                        iconColor="text-slate-400"
                    />
                )}
            </div>

            <AddApplicationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingApp(null);
                }}
                onSuccess={fetchApps}
                initialData={editingApp}
            />
        </div>
    );
};
