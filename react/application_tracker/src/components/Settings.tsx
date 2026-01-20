import { useEffect, useState } from 'react';
import { Save, RefreshCw, Globe, FileCode, Shield, Database, Server, Settings2 } from 'lucide-react';
import { getSupabaseClient, saveSupabaseConfig } from '../lib/supabase';
import { AppStorage } from '../lib/storage';
import { initFirebase, testFirebaseConnection } from '../lib/firebase';
import { motion } from 'framer-motion';

export const Settings = () => {
    // Supabase
    const [url, setUrl] = useState<string>('');
    const [key, setKey] = useState<string>('');
    const [sbStatus, setSbStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    // Firebase
    const [fbApiKey, setFbApiKey] = useState<string>('');
    const [fbAuthDomain, setFbAuthDomain] = useState<string>('');
    const [fbProjectId, setFbProjectId] = useState<string>('');
    const [fbAppId, setFbAppId] = useState<string>('');
    const [fbStatus, setFbStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    // Discovery
    const [githubUrl, setGithubUrl] = useState<string>('https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/dev/.github/scripts/data.json');
    const [dorkingTargets, setDorkingTargets] = useState<string>('Greenhouse, Lever, Ashby, Workable');

    useEffect(() => {
        const loadSettings = async () => {
            setUrl(await AppStorage.getItem('SUPABASE_URL') || '');
            setKey(await AppStorage.getItem('SUPABASE_ANON_KEY') || '');

            setFbApiKey(await AppStorage.getItem('FIREBASE_API_KEY') || '');
            setFbAuthDomain(await AppStorage.getItem('FIREBASE_AUTH_DOMAIN') || '');
            setFbProjectId(await AppStorage.getItem('FIREBASE_PROJECT_ID') || '');
            setFbAppId(await AppStorage.getItem('FIREBASE_APP_ID') || '');

            setGithubUrl(await AppStorage.getItem('GITHUB_SOURCE_URL') || 'https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/dev/.github/scripts/data.json');
            setDorkingTargets(await AppStorage.getItem('DORKING_TARGETS') || 'Greenhouse, Lever, Ashby, Workable');
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        await saveSupabaseConfig(url, key);

        // Save Firebase Config
        await AppStorage.setItem('FIREBASE_API_KEY', fbApiKey);
        await AppStorage.setItem('FIREBASE_AUTH_DOMAIN', fbAuthDomain);
        await AppStorage.setItem('FIREBASE_PROJECT_ID', fbProjectId);
        await AppStorage.setItem('FIREBASE_APP_ID', fbAppId);

        await AppStorage.setItem('GITHUB_SOURCE_URL', githubUrl);
        await AppStorage.setItem('DORKING_TARGETS', dorkingTargets);

        window.dispatchEvent(new Event('config-updated'));

        await initFirebase();
        setFbStatus('success');
        setSbStatus('success');
        setTimeout(() => {
            setFbStatus('idle');
            setSbStatus('idle');
        }, 3000);
    };

    const testConnection = async () => {
        setSbStatus('testing');
        try {
            const client = await getSupabaseClient(url, key);
            if (!client) throw new Error('Invalid config');
            const { error } = await client.from('applications').select('id').limit(1);
            if (error) throw error;
            setSbStatus('success');
        } catch (err) {
            console.error(err);
            setSbStatus('error');
        }
        setTimeout(() => setSbStatus('idle'), 3000);
    };

    const testFbConnection = async () => {
        setFbStatus('testing');
        try {
            await testFirebaseConnection({
                apiKey: fbApiKey,
                authDomain: fbAuthDomain,
                projectId: fbProjectId,
                appId: fbAppId
            });
            setFbStatus('success');
        } catch (err) {
            console.error(err);
            setFbStatus('error');
        }
        setTimeout(() => setFbStatus('idle'), 3000);
    };

    const sqlSchema = `-- Run this in your Supabase SQL Editor
-- SAFE TO RUN: This script checks "IF NOT EXISTS" and will not delete your data.

-- 1. Applications Table
create table if not exists public.applications (
  id serial not null,
  title character varying(255) not null,
  company_name character varying(255) not null,
  company_location character varying(255) null,
  company_website character varying(500) null,
  company_logo character varying(500) null,
  company_description text null,
  company_industry character varying(255) null,
  company_size character varying(100) null,
  position_description text null,
  salary_range character varying(100) null,
  application_date date not null default CURRENT_DATE,
  status character varying(50) not null default 'applied'::character varying,
  interview_date timestamp without time zone null,
  notes text null,
  contact_person character varying(255) null,
  contact_email character varying(255) null,
  contact_phone character varying(50) null,
  application_url character varying(500) null,
  resume_version character varying(100) null,
  cover_letter_version character varying(100) null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint internships_pkey primary key (id),
  constraint internships_status_check check (
    (
      (status)::text = any (
        array[
          ('applied'::character varying)::text,
          ('interview_scheduled'::character varying)::text,
          ('interview_completed'::character varying)::text,
          ('offer_received'::character varying)::text,
          ('offer_accepted'::character varying)::text,
          ('offer_declined'::character varying)::text,
          ('rejected'::character varying)::text,
          ('withdrawn'::character varying)::text
        ]
      )
    )
  )
);

-- 2. Documents Table
create table if not exists public.documents (
  id uuid not null default gen_random_uuid(),
  name text not null,
  type text not null,
  content text,
  version text,
  created_at timestamp with time zone default current_timestamp,
  constraint documents_pkey primary key (id)
);

-- 3. Security Policies (Idempotent)
alter table applications enable row level security;
drop policy if exists "Allow all access" on applications;
create policy "Allow all access" on applications for all using (true);

alter table documents enable row level security;
drop policy if exists "Allow all access" on documents;
create policy "Allow all access" on documents for all using (true);

-- 3. User Profiles Table
create table if not exists public.user_profiles (
  id uuid not null default gen_random_uuid(),
  user_id text unique,
  bio text,
  key_achievements text,
  experience_summary text,
  skills text,
  updated_at timestamp with time zone default current_timestamp,
  constraint user_profiles_pkey primary key (id)
);

alter table user_profiles enable row level security;
drop policy if exists "Allow all access" on user_profiles;
create policy "Allow all access" on user_profiles for all using (true);`;

    return (
        <div className="w-full max-w-7xl mx-auto space-y-12 pb-24 relative px-4 md:px-8">
            {/* Header */}
            <div className="space-y-4 pt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 shadow-sm"
                >
                    <Settings2 className="w-3 h-3" />
                    System Configuration
                </motion.div>
                <div className="space-y-2">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white tracking-tighter"
                    >
                        Control Center
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium max-w-lg text-lg"
                    >
                        Manage your backend connections, data sources, and security preferences.
                    </motion.p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 text-left">
                {/* Data Sources Config */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="col-span-1 lg:col-span-2 bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 w-full shadow-2xl shadow-black/20"
                >
                    <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                            <Database className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Discovery Sources</h3>
                            <p className="text-sm text-slate-400 font-medium">Configure where your job feed and search targets come from.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">GitHub Data URL</label>
                            <input
                                type="text"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                placeholder="https://raw.githubusercontent.com/..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono text-xs shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Smart Search Targets</label>
                            <input
                                type="text"
                                value={dorkingTargets}
                                onChange={(e) => setDorkingTargets(e.target.value)}
                                placeholder="Greenhouse, Lever, Ashby"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono text-xs shadow-inner"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Supabase Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-black/20"
                >
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                                <Globe className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Supabase Connection</h3>
                                <p className="text-sm text-slate-400 font-medium">Primary database for application tracking.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project URL</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-mono text-xs shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Anon Key</label>
                                <input
                                    type="password"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-mono text-xs shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={testConnection}
                        className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all text-xs uppercase tracking-wider shadow-sm hover:shadow-emerald-900/10"
                    >
                        {sbStatus === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
                        {sbStatus === 'success' ? 'Connected Successfully' : 'Test Connection'}
                    </button>
                </motion.div>

                {/* Firebase Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-black/20"
                >
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                                <Shield className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Firebase Auth</h3>
                                <p className="text-sm text-slate-400 font-medium">Secure entry point for user sessions.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">API Key</label>
                                <input
                                    type="password"
                                    value={fbApiKey}
                                    onChange={(e) => setFbApiKey(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all font-mono text-xs shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Auth Domain</label>
                                <input
                                    type="text"
                                    value={fbAuthDomain}
                                    onChange={(e) => setFbAuthDomain(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all font-mono text-xs shadow-inner"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project ID</label>
                                    <input
                                        type="text"
                                        value={fbProjectId}
                                        onChange={(e) => setFbProjectId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all font-mono text-xs shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">App ID</label>
                                    <input
                                        type="text"
                                        value={fbAppId}
                                        onChange={(e) => setFbAppId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all font-mono text-xs shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={testFbConnection}
                        className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all text-xs uppercase tracking-wider shadow-sm hover:shadow-rose-900/10"
                    >
                        {fbStatus === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                        {fbStatus === 'success' ? 'Authenticated' : 'Test Access'}
                    </button>
                </motion.div>
            </div>

            {/* SQL Helper */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl shadow-black/20"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                            <FileCode className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Database Schema Helper</h3>
                            <p className="text-xs text-slate-500 font-medium">Use this SQL to initialize your Supabase tables.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(sqlSchema);
                            alert('SQL copied!');
                        }}
                        className="px-4 py-2 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                    >
                        Copy SQL
                    </button>
                </div>
                <div className="bg-slate-950 rounded-xl p-6 border border-slate-900 overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-950/90 pointer-events-none" />
                    <pre className="text-[10px] text-slate-500 font-mono leading-relaxed opacity-70">
                        {sqlSchema}
                    </pre>
                </div>
            </motion.div>

            <div className="sticky bottom-8 left-0 right-0 flex justify-center pt-8 pointer-events-none z-50">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-black font-black hover:bg-slate-200 shadow-2xl shadow-white/10 active:scale-95 transition-all text-xs uppercase tracking-widest pointer-events-auto border border-white/50"
                >
                    <Save className="w-5 h-5" />
                    {fbStatus === 'success' ? 'All Systems Synced' : 'Save Configuration'}
                </button>
            </div>
        </div>
    );
};
