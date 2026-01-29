import { useEffect, useState } from 'react';
import { Save, RefreshCw, Globe, FileCode, Shield, Server, Settings2, CheckCircle2, AlertCircle, Cpu } from 'lucide-react';
import { getSupabaseClient, saveSupabaseConfig } from '../lib/supabase';
import { AppStorage } from '../lib/storage';
import { initFirebase, testFirebaseConnection } from '../lib/firebase';
import { checkOllamaConnection } from '../lib/ollama';
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



    // AI
    const [aiProvider, setAiProvider] = useState<'gemini' | 'ollama'>('gemini');
    const [ollamaUrl, setOllamaUrl] = useState<string>('http://localhost:11434');
    const [ollamaModel, setOllamaModel] = useState<string>('llama3');
    const [ollamaStatus, setOllamaStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    useEffect(() => {
        const loadSettings = async () => {
            setUrl(await AppStorage.getItem('SUPABASE_URL') || import.meta.env.VITE_SUPABASE_URL || '');
            setKey(await AppStorage.getItem('SUPABASE_ANON_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');

            setFbApiKey(await AppStorage.getItem('FIREBASE_API_KEY') || import.meta.env.VITE_FIREBASE_API_KEY || '');
            setFbAuthDomain(await AppStorage.getItem('FIREBASE_AUTH_DOMAIN') || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '');
            setFbProjectId(await AppStorage.getItem('FIREBASE_PROJECT_ID') || import.meta.env.VITE_FIREBASE_PROJECT_ID || '');
            setFbAppId(await AppStorage.getItem('FIREBASE_APP_ID') || import.meta.env.VITE_FIREBASE_APP_ID || '');



            setAiProvider(await AppStorage.getItem('AI_PROVIDER') as any || 'gemini');
            setOllamaUrl(await AppStorage.getItem('OLLAMA_URL') || 'http://localhost:11434');
            setOllamaModel(await AppStorage.getItem('OLLAMA_MODEL') || 'llama3');
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



        await AppStorage.setItem('AI_PROVIDER', aiProvider);
        await AppStorage.setItem('OLLAMA_URL', ollamaUrl);
        await AppStorage.setItem('OLLAMA_MODEL', ollamaModel);

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

    const testOllamaConnection = async () => {
        setOllamaStatus('testing');
        const success = await checkOllamaConnection(ollamaUrl);
        setOllamaStatus(success ? 'success' : 'error');
        setTimeout(() => setOllamaStatus('idle'), 3000);
    };

    const sqlSchema = `-- 1. Migration Logic: Rename legacy 'internships' table to 'applications' if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'internships') THEN
    ALTER TABLE IF EXISTS internships RENAME TO applications;
  END IF;
END $$;

-- 2. Applications Table Definition
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Core Fields
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied',
  
  -- Details
  location TEXT,
  salary_range TEXT,
  job_url TEXT,
  notes TEXT,
  
  -- Dates
  applied_date DATE DEFAULT CURRENT_DATE,
  last_activity TIMESTAMPTZ DEFAULT now(),
  
  -- Contact Info
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- V2 Fields (Ensure existence if table was renamed)
  salary_min NUMERIC,
  salary_max NUMERIC,
  currency TEXT DEFAULT 'USD',
  locations TEXT[],           -- Array of strings for multiple locations
  rejection_source TEXT,      -- 'Me' | 'Them' | 'Auto'
  rejection_reason TEXT,
  interview_stages JSONB DEFAULT '[]'::jsonb
);

-- 3. Add Columns Safely (Idempotent Migration for existing tables)
DO $$
BEGIN
    -- Ensure columns exist if table was migrated or created with old schema
    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS salary_min NUMERIC;
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS salary_max NUMERIC;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
         ALTER TABLE applications ADD COLUMN IF NOT EXISTS locations TEXT[];
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS rejection_source TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_stages JSONB DEFAULT '[]'::jsonb;
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_version TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS cover_letter_version TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
END $$;


-- 4. Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Allow all access" ON applications;
CREATE POLICY "Allow all access" ON applications FOR ALL USING (true) WITH CHECK (true);

-- 6. User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE,
  bio TEXT,
  key_achievements TEXT,
  experience_summary TEXT,
  skills TEXT,
  updated_at TIMESTAMPTZ DEFAULT current_timestamp
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access" ON user_profiles;
CREATE POLICY "Allow all access" ON user_profiles FOR ALL USING (true);`;

    const StatusBadge = ({ status }: { status: 'idle' | 'testing' | 'success' | 'error' }) => {
        if (status === 'idle') return null;
        if (status === 'testing') return <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />;
        if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
        if (status === 'error') return <AlertCircle className="w-4 h-4 text-rose-400" />;
        return null;
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-12 pb-24 relative px-4 md:px-8">
            {/* Header */}
            <div className="space-y-4 pt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-2 shadow-sm backdrop-blur-md"
                >
                    <Settings2 className="w-3 h-3" />
                    System Configuration
                </motion.div>
                <div className="space-y-2">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white tracking-tighter glow-text"
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


                {/* AI Config */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    className="col-span-1 lg:col-span-2 glass-card rounded-3xl p-8 w-full relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center gap-5 mb-8 border-b border-white/10 pb-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/10">
                            <Cpu className="w-7 h-7 text-fuchsia-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-white">AI Intelligence</h3>
                                {aiProvider === 'ollama' && <StatusBadge status={ollamaStatus} />}
                            </div>
                            <p className="text-sm text-slate-400 font-medium mt-1">Configure your LLM provider for Resume Analysis and Cover Letters.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Provider</label>
                            <select
                                value={aiProvider}
                                onChange={(e) => setAiProvider(e.target.value as any)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all font-mono text-xs shadow-inner backdrop-blur-sm appearance-none"
                            >
                                <option value="gemini">Gemini (Cloud)</option>
                                <option value="ollama">Ollama (Local)</option>
                            </select>
                        </div>
                        {aiProvider === 'ollama' && (
                            <>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ollama URL</label>
                                    <input
                                        type="text"
                                        value={ollamaUrl}
                                        onChange={(e) => setOllamaUrl(e.target.value)}
                                        placeholder="http://localhost:11434"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all font-mono text-xs shadow-inner backdrop-blur-sm"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Model Name</label>
                                    <input
                                        type="text"
                                        value={ollamaModel}
                                        onChange={(e) => setOllamaModel(e.target.value)}
                                        placeholder="llama3"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all font-mono text-xs shadow-inner backdrop-blur-sm"
                                    />
                                </div>
                                <button
                                    onClick={testOllamaConnection}
                                    disabled={ollamaStatus === 'testing'}
                                    className="md:col-span-2 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-fuchsia-500/10 hover:text-fuchsia-400 hover:border-fuchsia-500/30 transition-all text-xs uppercase tracking-wider mt-2"
                                >
                                    {ollamaStatus === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
                                    {ollamaStatus === 'success' ? 'Connected to Local LLM' : 'Test Ollama Connection'}
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Supabase Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-3xl p-8 flex flex-col justify-between"
                >
                    <div className="space-y-8">
                        <div className="flex items-center gap-5 mb-2">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                <Globe className="w-7 h-7 text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Supabase Connection</h3>
                                    <StatusBadge status={sbStatus} />
                                </div>
                                <p className="text-sm text-slate-400 font-medium mt-1">Primary database for application tracking.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project URL</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono text-xs shadow-inner backdrop-blur-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Anon Key</label>
                                <input
                                    type="password"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono text-xs shadow-inner backdrop-blur-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={testConnection}
                        disabled={sbStatus === 'testing'}
                        className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all text-xs uppercase tracking-wider"
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
                    className="glass-card rounded-3xl p-8 flex flex-col justify-between"
                >
                    <div className="space-y-8">
                        <div className="flex items-center gap-5 mb-2">
                            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-lg shadow-rose-500/10">
                                <Shield className="w-7 h-7 text-rose-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Firebase Auth</h3>
                                    <StatusBadge status={fbStatus} />
                                </div>
                                <p className="text-sm text-slate-400 font-medium mt-1">Secure entry point for user sessions.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">API Key</label>
                                <input
                                    type="password"
                                    value={fbApiKey}
                                    onChange={(e) => setFbApiKey(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all font-mono text-xs shadow-inner backdrop-blur-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Auth Domain</label>
                                <input
                                    type="text"
                                    value={fbAuthDomain}
                                    onChange={(e) => setFbAuthDomain(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all font-mono text-xs shadow-inner backdrop-blur-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project ID</label>
                                    <input
                                        type="text"
                                        value={fbProjectId}
                                        onChange={(e) => setFbProjectId(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all font-mono text-xs shadow-inner backdrop-blur-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">App ID</label>
                                    <input
                                        type="text"
                                        value={fbAppId}
                                        onChange={(e) => setFbAppId(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all font-mono text-xs shadow-inner backdrop-blur-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={testFbConnection}
                        disabled={fbStatus === 'testing'}
                        className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all text-xs uppercase tracking-wider"
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
                className="glass-card rounded-3xl p-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            <FileCode className="w-6 h-6 text-slate-300" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Database Schema Helper</h3>
                            <p className="text-xs text-slate-400 font-medium mt-1">Use this SQL to initialize your Supabase tables.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(sqlSchema);
                            alert('SQL copied!');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                    >
                        Copy SQL
                    </button>
                </div>
                <div className="bg-app-card rounded-xl p-6 border border-white/5 overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-app-card/90 pointer-events-none" />
                    <pre className="text-[10px] text-slate-500 font-mono leading-relaxed opacity-70">
                        {sqlSchema}
                    </pre>
                </div>
            </motion.div>

            <div className="sticky bottom-6 left-0 right-0 flex justify-center pt-8 pointer-events-none z-50">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-black font-black hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 transition-all text-xs uppercase tracking-widest pointer-events-auto ring-1 ring-white/50"
                >
                    <Save className="w-5 h-5" />
                    {fbStatus === 'success' && sbStatus === 'success' ? 'All Systems Synced' : 'Save Configuration'}
                </button>
            </div>
        </div>
    );
};
