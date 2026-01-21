import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Send, Users, CheckCircle, Clock, AlertCircle, Unplug, Plus, Search, FileText, ArrowUpRight, LayoutDashboard } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { AppStorage } from '../lib/storage';
import { Application } from '../types';
import { cn } from '../lib/utils';
import { EmptyState } from './EmptyState';

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ElementType;
    color: string;
    delay?: number;
}

const StatCard = ({ label, value, icon: Icon, color, delay = 0 }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden group transition-all duration-300 hover:bg-white/5 hover:border-white/10"
    >
        <div className={cn("absolute right-[-10%] top-[-10%] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500", color)}>
            <Icon size={120} />
        </div>

        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 shadow-inner border border-white/5 backdrop-blur-sm", color.replace('text-', 'bg-').replace('400', '500/10'))}>
            <Icon className={cn("w-6 h-6", color)} />
        </div>

        <div>
            <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide">{label}</p>
            <h3 className="text-3xl font-black text-white tracking-tight glow-text">{value}</h3>
        </div>
    </motion.div>
);

export const Dashboard = () => {
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasConfig, setHasConfig] = useState<boolean>(false);

    useEffect(() => {
        const checkConfig = async () => {
            const url = await AppStorage.getItem('SUPABASE_URL');
            setHasConfig(!!url);
            if (!!url) fetchApps();
        };

        const fetchApps = async () => {
            setLoading(true);
            const client = await getSupabaseClient();
            if (!client) {
                setLoading(false);
                return;
            }
            const { data } = await client.from('applications').select('*');
            if (data) setApps(data);
            setLoading(false);
        };

        checkConfig();

        window.addEventListener('config-updated', checkConfig);
        return () => window.removeEventListener('config-updated', checkConfig);
    }, []);

    const changeTab = (tab: string) => {
        window.dispatchEvent(new CustomEvent('changeTab', { detail: tab }));
    };

    const stats = [
        { label: 'Total Applications', value: apps.length, icon: Send, color: 'text-indigo-400', delay: 0.1 },
        { label: 'Active Interviews', value: apps.filter(a => ['interview_scheduled', 'interview_completed'].includes(a.status)).length, icon: Users, color: 'text-amber-400', delay: 0.2 },
        { label: 'Pending Offers', value: apps.filter(a => a.status === 'offer_accepted').length, icon: CheckCircle, color: 'text-emerald-400', delay: 0.3 },
        { label: 'Rejections', value: apps.filter(a => a.status === 'rejected').length, icon: AlertCircle, color: 'text-rose-400', delay: 0.4 },
    ];

    const nextInterview = apps.find(a => a.status === 'interview_scheduled');

    if (!hasConfig) {
        return (
            <EmptyState
                icon={Unplug}
                iconColor="text-rose-500"
                title="No Database Link"
                description="Your application isn't connected to a database yet. Head to settings to link your Supabase project and get started."
                actionLabel="Go to Settings"
                onAction={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'settings' }))}
            />
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
                <p className="text-slate-500 font-bold text-sm animate-pulse tracking-widest uppercase">Syncing Backend</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-2 shadow-sm backdrop-blur-md">
                        <LayoutDashboard className="w-3 h-3" />
                        Dashboard
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter glow-text">Overview</h2>
                    <p className="text-slate-400 font-medium text-lg">Tracking <span className="text-indigo-400 font-bold">{apps.length}</span> active opportunities.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            {nextInterview && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-3xl p-px group"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-amber-500/50 via-indigo-500/50 to-amber-500/50 opacity-50 blur-xl group-hover:opacity-75 transition-opacity" />
                    <div className="bg-app-card/90 backdrop-blur-xl rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 border border-white/10">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                <Clock className="w-8 h-8 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Coming Up Next</p>
                                <h3 className="text-xl font-bold text-white mb-1">Interview with {nextInterview.company_name}</h3>
                                <p className="text-sm text-slate-400 font-medium">{nextInterview.title}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => changeTab('applications')}
                            className="px-8 py-3 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-amber-500/20 relative z-10"
                        >
                            Prepare Now
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                            Recent Activity
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {apps.slice(0, 5).map((app) => (
                            <div key={app.id} onClick={() => changeTab('applications')} className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-all group cursor-pointer">
                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center font-black text-indigo-400 border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                                        {app.company_logo ? (
                                            <img src={app.company_logo} alt={app.company_name} className="w-6 h-6 object-contain" />
                                        ) : (
                                            app.company_name[0]
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{app.company_name}</h4>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider group-hover:text-indigo-400 transition-colors">{app.title}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <span className={cn(
                                        "text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest text-center min-w-[100px] border backdrop-blur-md",
                                        app.status === 'offer_accepted' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            app.status === 'rejected' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                                "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                    )}>
                                        {app.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {apps.length === 0 && (
                            <div className="text-center py-16 flex flex-col items-center gap-4 border border-dashed border-slate-800 rounded-3xl bg-slate-950/30">
                                <Clock className="w-12 h-12 text-slate-800" />
                                <div>
                                    <p className="text-slate-400 font-bold">No activity yet</p>
                                    <p className="text-slate-600 text-sm">Add your first application to see overview stats.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-card rounded-3xl p-8 h-fit">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                        <Plus className="w-5 h-5 text-amber-400" />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => changeTab('applications')}
                            className="w-full bg-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 text-slate-300 hover:text-white p-4 rounded-xl font-bold transition-all text-sm text-left flex items-center justify-between border border-white/5 group active:scale-95"
                        >
                            <div className="flex items-center gap-3">
                                <Plus className="w-4 h-4 text-indigo-400" />
                                New Application
                            </div>
                            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0 text-indigo-400" />
                        </button>
                        <button
                            onClick={() => changeTab('discovery')}
                            className="w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white p-4 rounded-xl font-bold transition-all text-sm text-left flex items-center justify-between border border-white/5 group active:scale-95"
                        >
                            <div className="flex items-center gap-3">
                                <Search className="w-4 h-4 text-amber-400" />
                                Smart Job Search
                            </div>
                        </button>
                        <button
                            onClick={() => changeTab('resume')}
                            className="w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white p-4 rounded-xl font-bold transition-all text-sm text-left flex items-center justify-between border border-white/5 group active:scale-95"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-emerald-400" />
                                Analyze Resume
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Status Breakdown</h4>
                        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-black/50 p-px border border-white/5 mb-4">
                            {['applied', 'interview_scheduled', 'offer_accepted', 'rejected'].map((status, idx) => {
                                const count = apps.filter(a => a.status === status || (status === 'interview_scheduled' && a.status === 'interview_completed')).length;
                                const percent = apps.length > 0 ? (count / apps.length) * 100 : 0;
                                const colors = ['bg-indigo-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500'];
                                return (
                                    <div key={status} style={{ width: `${percent}%` }} className={cn("h-full rounded-sm transition-all duration-1000", colors[idx])} />
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" /> Applied</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" /> Interview</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Offer</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" /> Rejected</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
