import { useState, useEffect } from 'react';
import {
    FileText, RefreshCw, Upload, Sparkles, ScanSearch,
    Wand2, Save, AlertCircle, CheckCircle, Target, Zap, LayoutDashboard,
    Key, Bot, BrainCircuit, X, Loader2, Trash2, Download, MousePointerClick
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '../lib/supabase';
import { AppDocument } from '../types';
import { analyzeResume, ATSResult } from '../lib/ats';

import { initializeGemini, checkGeminiReady } from '../lib/gemini'; // Keep specific init for API key modal if used
import { analyzeResumeAI, generateCoverLetterAI } from '../lib/ai';
import * as pdfjsLib from 'pdfjs-dist';

// Type definition to suppress TS errors if any
declare global {
    interface Window {
        pdfjsLib: typeof pdfjsLib;
    }
}

export const ResumeLab = () => {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ATSResult | null>(null);

    // AI State
    const [useAI, setUseAI] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);

    // Cover Letter State
    const [targetCompany, setTargetCompany] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [generatedCL, setGeneratedCL] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'upload' | 'analysis' | 'cover-letter'>('upload');

    // Real Document State
    const [documents, setDocuments] = useState<AppDocument[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    useEffect(() => {
        fetchDocs();

        // Initialize PDF.js worker
        if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        }

        if (checkGeminiReady()) {
            setUseAI(true);
        }

        window.addEventListener('config-updated', fetchDocs);
        return () => window.removeEventListener('config-updated', fetchDocs);
    }, []);

    const fetchDocs = async () => {
        setLoadingDocs(true);
        const client = await getSupabaseClient();
        if (client) {
            const { data } = await client.from('documents').select('*').order('created_at', { ascending: false });
            if (data) setDocuments(data);
        }
        setLoadingDocs(false);
    };

    const handleApiKeySubmit = () => {
        if (initializeGemini(apiKey)) {
            setUseAI(true);
            setShowApiKeyModal(false);
        } else {
            alert('Invalid API Key format');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type === 'application/pdf') {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;

                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items
                        .map((item: unknown) => (item as { str: string }).str)
                        .join(' ');
                    fullText += pageText + '\n\n';
                }

                if (!fullText.trim()) {
                    alert('Warning: Could not extract text from this PDF. It might be an image-only PDF.');
                }

                setResumeText(fullText);
                await saveDocument(file.name, 'resume', fullText);

            } catch (error) {
                console.error('PDF Load Error:', error);
                alert('Error parsing PDF. Please try a TXT or MD file instead.');
            }
        } else {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const content = event.target?.result as string;
                setResumeText(content);
                await saveDocument(file.name, 'resume', content);
            };
            reader.readAsText(file);
        }
    };

    const saveDocument = async (name: string, type: 'resume' | 'cover_letter' | 'other', content: string) => {
        const client = await getSupabaseClient();
        if (!client) return;

        const { error } = await client.from('documents').insert([
            {
                name,
                type,
                content,
                version: 'v1',
                created_at: new Date().toISOString()
            }
        ]);

        if (error) {
            console.error('Save error:', error);
        } else {
            fetchDocs();
        }
    };

    const handleDeleteDocument = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this document?')) return;

        const client = await getSupabaseClient();
        if (!client) return;

        const { error } = await client.from('documents').delete().eq('id', id);

        if (error) {
            console.error('Delete error', error);
            alert('Failed to delete document');
        } else {
            fetchDocs();
        }
    };

    const handleDownloadDocument = (doc: AppDocument, e: React.MouseEvent) => {
        e.stopPropagation();
        const blob = new Blob([doc.content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.name}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const handleAnalyze = async () => {
        if (!resumeText || !jobDescription) return;
        setIsAnalyzing(true);
        setActiveTab('analysis');

        try {
            if (useAI) {
                const aiResult = await analyzeResumeAI(resumeText, jobDescription);
                // Map AI result to our internal format
                setAnalysisResult({
                    totalScore: aiResult.score,
                    feedback: aiResult.feedback,
                    details: {
                        keywords: {
                            // Calculate keyword score as residual or proportional
                            score: Math.max(0, aiResult.score - (aiResult.impact.score + aiResult.formatting.score + aiResult.actionVerbs.score)),
                            found: aiResult.keywords.found,
                            missing: aiResult.keywords.missing
                        },
                        impact: {
                            score: aiResult.impact.score,
                            feedback: aiResult.impact.feedback,
                            metricsFound: aiResult.impact.metricsFound
                        },
                        formatting: {
                            score: aiResult.formatting.score,
                            missingSections: aiResult.formatting.missingSections
                        },
                        actionVerbs: {
                            score: aiResult.actionVerbs.score,
                            count: aiResult.actionVerbs.count
                        }
                    },
                    reasoning: aiResult.reasoning,
                    suggestions: aiResult.suggestions
                });
            } else {
                // ...
            }
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = (err as Error)?.message || "Unknown error";
            alert(`AI Analysis failed: ${errorMessage}. Falling back to standard engine.`);
            // Fallback
            const result = analyzeResume(resumeText, jobDescription);
            setAnalysisResult(result);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const generateCoverLetter = async () => {
        if (!targetCompany || !targetRole) return;
        setIsGenerating(true);

        try {
            if (useAI) {
                const profileContext = localStorage.getItem('user_profile_context');
                const parsedContext = profileContext ? JSON.parse(profileContext) : undefined;

                const letter = await generateCoverLetterAI(resumeText, jobDescription, parsedContext);
                setGeneratedCL(letter);
            } else {
                // Template fallback
                setTimeout(() => {
                    const template = `Dear Hiring Manager at ${targetCompany},\n\nI am writing to express my enthusiastic interest in the ${targetRole} position... (Enable AI for a custom letter)`;
                    setGeneratedCL(template);
                }, 1200);
            }
        } catch (e: unknown) {
            console.error("AI Generation failed", e);
            const errorMessage = (e as Error)?.message || "Unknown error";
            alert(`AI generation failed. Error: ${errorMessage}\nPlease check your API Key / Console for details.`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 relative pb-12 w-full max-w-7xl mx-auto px-4 md:px-8 pt-4">
            <AnimatePresence>
                {showApiKeyModal && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-950 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50" />
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Key className="w-4 h-4 text-indigo-400" /> Enter Gemini API Key
                                </h3>
                                <button onClick={() => setShowApiKeyModal(false)} className="hover:rotate-90 transition-transform duration-300"><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
                            </div>
                            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                                To use AI features, please provide your Google Gemini API Key. It will be stored in your session.
                            </p>
                            <div className="relative mb-6">
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={e => setApiKey(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 font-mono"
                                    placeholder="AIzaSy..."
                                />
                            </div>
                            <button
                                onClick={handleApiKeySubmit}
                                className="w-full bg-white text-black hover:bg-slate-200 font-bold py-3 rounded-xl transition-all text-sm tracking-wide"
                            >
                                Activate AI
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Header / Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-2 shadow-sm backdrop-blur-md">
                        <ScanSearch className="w-3 h-3" />
                        Resume Lab
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter glow-text text-left">Resume Analysis</h2>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-slate-400 font-medium text-lg">AI-Powered ATS Optimization & Calibration.</p>
                        <button
                            onClick={() => !useAI ? setShowApiKeyModal(true) : setUseAI(!useAI)}
                            className={`text-[10px] px-3 py-1 rounded-full border flex items-center gap-2 transition-all font-bold tracking-wide ${useAI
                                ? 'bg-primary/10 text-primary border-primary/20'
                                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
                                }`}
                        >
                            {useAI ? <Bot className="w-3 h-3" /> : <BrainCircuit className="w-3 h-3" />}
                            {useAI ? 'GEMINI ACTIVE' : 'ENABLE AI'}
                        </button>
                    </div>
                </div>

                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto backdrop-blur-md">
                    {['upload', 'analysis', 'cover-letter'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'upload' | 'analysis' | 'cover-letter')}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === tab
                                ? 'text-white'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/10 border border-white/5 rounded-xl shadow-sm backdrop-blur-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.replace('-', ' ').toUpperCase()}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-[600px] relative z-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Left: Editor */}
                            <div className="lg:col-span-8 glass-card rounded-3xl p-1.5 flex flex-col relative group min-h-[600px]">
                                <div className="absolute top-5 right-5 z-20 flex gap-2">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="resume-upload"
                                            className="hidden"
                                            accept=".txt,.md,.pdf"
                                            onChange={handleFileUpload}
                                        />
                                        <label
                                            htmlFor="resume-upload"
                                            className="px-4 py-2 bg-black/60 hover:bg-white text-slate-300 hover:text-black rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border border-white/10 hover:border-white shadow-lg backdrop-blur-md"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            Import File
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1 bg-black/40 rounded-[20px] relative overflow-hidden backdrop-blur-sm border border-white/5">
                                    <textarea
                                        value={resumeText}
                                        onChange={(e) => setResumeText(e.target.value)}
                                        placeholder="// Paste resume content here..."
                                        className="w-full h-full bg-transparent p-8 text-sm text-slate-300 font-mono focus:outline-none resize-none leading-relaxed selection:bg-indigo-500/30 placeholder:text-slate-700"
                                    />
                                </div>
                            </div>

                            {/* Right: Job Context */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="flex-1 glass-card rounded-3xl p-6 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Target className="w-4 h-4 text-indigo-400" /> Target Job
                                        </h3>
                                    </div>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste Job Description here..."
                                        className="flex-1 w-full bg-black/20 border border-white/10 rounded-xl p-4 text-xs text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-white/20 resize-none font-mono leading-relaxed transition-colors min-h-[200px] backdrop-blur-sm shadow-inner"
                                    />
                                </div>

                                <button
                                    disabled={isAnalyzing || !resumeText || !jobDescription}
                                    onClick={handleAnalyze}
                                    className={`h-16 rounded-2xl text-white font-bold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 flex items-center justify-center gap-3 border border-white/10 relative overflow-hidden group ${useAI ? 'bg-primary hover:bg-primary/90' : 'bg-slate-800 hover:bg-slate-700'}`}
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    {isAnalyzing ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {useAI ? <Sparkles className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                                            <span>{useAI ? 'Run Deep Scan' : 'Run Analysis'}</span>
                                        </>
                                    )}
                                </button>

                                <div className="glass-card rounded-3xl p-6 flex-1 min-h-[300px]">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                                        <FileText className="w-4 h-4" /> Attributes Library
                                        {loadingDocs && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                                    </h3>
                                    <div className="space-y-3">
                                        {documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                onClick={() => {
                                                    setResumeText(doc.content);
                                                }}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 cursor-pointer transition-all group relative overflow-hidden hover:bg-white/10"
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${doc.type === 'resume' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                                                        }`}>
                                                        {doc.type.replace('_', ' ')}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-slate-600 font-medium">{new Date(doc.created_at).toLocaleDateString()}</span>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => handleDownloadDocument(doc, e)}
                                                                className="p-1 hover:bg-white/20 rounded-md text-slate-400 hover:text-white transition-colors"
                                                                title="Download"
                                                            >
                                                                <Download className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDeleteDocument(doc.id, e)}
                                                                className="p-1 hover:bg-red-500/20 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-400 font-medium truncate group-hover:text-slate-200 transition-colors mt-2">
                                                    {doc.name}
                                                </p>
                                            </div>
                                        ))}
                                        {documents.length === 0 && (
                                            <div className="text-center py-12 text-slate-600 text-xs font-medium border border-dashed border-white/10 rounded-2xl">
                                                No saved documents found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'analysis' && (
                        isAnalyzing ? (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-[500px] glass-card rounded-[2.5rem] text-center p-12 border border-white/10"
                            >
                                <div className="w-24 h-24 rounded-full bg-black/30 flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl animate-pulse" />
                                    <Loader2 className="w-10 h-10 text-indigo-400 animate-spin relative z-10" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3">Analyzing Resume</h3>
                                <p className="text-slate-400 max-w-md mx-auto font-medium leading-relaxed">
                                    Scanning your resume against the job description to identify impact metrics, keywords, and formatting improvements...
                                </p>
                            </motion.div>
                        ) : analysisResult ? (
                            <motion.div
                                key="analysis"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                            >
                                {/* Score Gauge */}
                                {/* LEFT COLUMN: Metrics & Data (4 cols) */}
                                <div className="lg:col-span-4 space-y-6">
                                    {/* Score Card */}
                                    <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-radial from-indigo-500/10 to-transparent opacity-50"></div>
                                        <div className="relative z-10 text-center">
                                            <div className={`text-6xl font-black mb-2 tracking-tighter drop-shadow-lg ${analysisResult.totalScore >= 75 ? 'text-emerald-400' :
                                                analysisResult.totalScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                                                }`}>
                                                {analysisResult.totalScore}
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5 inline-block">Match Score</p>
                                        </div>

                                        <div className="mt-6 flex flex-col gap-3 w-full">
                                            {[
                                                { label: 'Keywords', score: analysisResult.details.keywords.score, max: 45, color: 'bg-primary' },
                                                { label: 'Impact', score: analysisResult.details.impact.score, max: 25, color: 'bg-violet-500' },
                                                { label: 'Format', score: analysisResult.details.formatting.score, max: 20, color: 'bg-pink-500' },
                                                { label: 'Verbs', score: analysisResult.details.actionVerbs.score, max: 15, color: 'bg-orange-500' }
                                            ].map((metric) => (
                                                <div key={metric.label}>
                                                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                                                        <span>{metric.label}</span>
                                                        <span>{metric.score}/{metric.max}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                        <div className={`h-full ${metric.color} rounded-full shadow-sm`} style={{ width: `${(metric.score / metric.max) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Impact Metrics */}
                                    <div className="glass-card rounded-3xl p-6">
                                        <h4 className="text-xs font-black text-violet-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Zap className="w-4 h-4" /> Impact Metrics
                                        </h4>
                                        <div className="space-y-2">
                                            {analysisResult.details.impact.metricsFound.map((m, i) => (
                                                <div key={i} className="flex items-start gap-3 text-xs text-slate-400 font-mono bg-black/20 px-3 py-2 rounded-lg border border-white/5">
                                                    <span className="mt-0.5 w-4 h-4 rounded-md bg-violet-500/10 text-violet-400 flex items-center justify-center text-[9px] font-bold border border-violet-500/10 shrink-0">#</span>
                                                    <span className="break-all">{m}</span>
                                                </div>
                                            ))}
                                            {analysisResult.details.impact.metricsFound.length === 0 && (
                                                <span className="text-slate-600 text-xs font-medium italic">No quantified metrics found.</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Keywords Cloud */}
                                    <div className="glass-card rounded-3xl p-6">
                                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Target className="w-4 h-4" /> Keywords
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {analysisResult.details.keywords.found.map((k, i) => (
                                                <span key={i} className="px-2 py-1 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 rounded-md text-[10px] font-mono font-medium">
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                        {analysisResult.details.keywords.missing.length > 0 && (
                                            <>
                                                <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    Missing
                                                </h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {analysisResult.details.keywords.missing.map((k, i) => (
                                                        <span key={i} className="px-2 py-1 bg-rose-500/5 text-rose-400 border border-rose-500/10 rounded-md text-[10px] font-mono font-medium opacity-80">
                                                            {k}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Formatting */}
                                    <div className="glass-card rounded-3xl p-6">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <LayoutDashboard className="w-4 h-4" /> Formatting
                                        </h4>
                                        <div className="space-y-2">
                                            {analysisResult.details.formatting.missingSections.length > 0 ? (
                                                analysisResult.details.formatting.missingSections.map(s => (
                                                    <div key={s} className="text-xs text-rose-400 flex items-center gap-2 bg-rose-500/5 px-3 py-2 rounded-lg border border-rose-500/10">
                                                        <AlertCircle className="w-3 h-3" /> Missing: <span className="font-bold uppercase">{s}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-xs text-emerald-400 flex items-center gap-2 bg-emerald-500/5 px-3 py-2 rounded-lg border border-emerald-500/10">
                                                    <CheckCircle className="w-3 h-3" /> All Sections Present
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: Insights & Advice (8 cols) */}
                                <div className="lg:col-span-8 space-y-6">
                                    {/* Reasoning Panel */}
                                    <div className="glass-card rounded-3xl p-8">
                                        <h4 className="text-sm font-black text-indigo-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <Bot className="w-5 h-5" /> AI Analysis Reasoning
                                        </h4>
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <p className="text-base text-slate-300 leading-relaxed font-medium">
                                                {analysisResult.reasoning || analysisResult.feedback}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Suggestions */}
                                    {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                                        <div className="glass-card rounded-3xl p-8">
                                            <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5" /> Strategic Improvements
                                            </h4>
                                            <div className="space-y-4">
                                                {analysisResult.suggestions.map((s, i) => (
                                                    <div key={i} className={`p-6 rounded-2xl border transition-all hover:bg-white/5 ${s.importance === 'high' ? 'bg-rose-500/5 border-rose-500/10' :
                                                        s.importance === 'medium' ? 'bg-amber-500/5 border-amber-500/10' :
                                                            'bg-emerald-500/5 border-emerald-500/10'
                                                        }`}>
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <span className={`w-2 h-2 rounded-full ${s.importance === 'high' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                                                                s.importance === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                                                }`} />
                                                            <h5 className={`text-sm font-black uppercase tracking-wide ${s.importance === 'high' ? 'text-rose-400' :
                                                                s.importance === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                                                                }`}>{s.title}</h5>
                                                            <span className="ml-auto text-[10px] font-bold bg-black/20 px-2 py-1 rounded-full text-slate-500 border border-white/5 uppercase">
                                                                {s.importance} Priority
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-300 leading-7 font-medium pl-5 border-l-2 border-white/5">
                                                            {s.explanation}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty-analysis"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-[500px] glass-card rounded-[2.5rem] text-center p-12 border border-white/10"
                            >
                                <div className="w-24 h-24 rounded-full bg-black/30 flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10">
                                    <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3">Ready to Analyze</h3>
                                <p className="text-slate-400 max-w-md mx-auto mb-8 font-medium leading-relaxed">
                                    Upload your resume and the job description in the <span className="text-white font-bold cursor-pointer hover:underline" onClick={() => setActiveTab('upload')}>Upload Tab</span> to get AI-powered insights, ATS scoring, and optimization suggestions.
                                </p>
                                <button
                                    onClick={() => setActiveTab('upload')}
                                    className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-all text-sm tracking-wide flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                >
                                    <MousePointerClick className="w-4 h-4" />
                                    Go to Upload
                                </button>
                            </motion.div>
                        )
                    )}

                    {activeTab === 'cover-letter' && (
                        <motion.div
                            key="cl"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            <div className="lg:col-span-8 lg:col-start-3 glass-card rounded-3xl p-10 flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-indigo-500/10">
                                            <Wand2 className="w-7 h-7 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                                Cover Letter
                                                {useAI && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold tracking-wide shadow-lg shadow-indigo-500/20">AI ENABLED</span>}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Smart Generator</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => saveDocument(`${targetCompany || 'Draft'} CL`, 'cover_letter', generatedCL)}
                                        disabled={!generatedCL}
                                        className="text-xs font-bold text-emerald-400 flex items-center gap-2 hover:bg-emerald-500/10 px-4 py-2 rounded-xl transition-all disabled:opacity-0 border border-transparent hover:border-emerald-500/20"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save to Documents
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-8 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Company Name</label>
                                        <input
                                            type="text"
                                            value={targetCompany}
                                            onChange={(e) => setTargetCompany(e.target.value)}
                                            placeholder="e.g. Acme Corp"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors font-medium backdrop-blur-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Job Title</label>
                                        <input
                                            type="text"
                                            value={targetRole}
                                            onChange={(e) => setTargetRole(e.target.value)}
                                            placeholder="e.g. Senior Developer"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors font-medium backdrop-blur-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 relative p-8 overflow-y-auto min-h-[400px] mb-6 backdrop-blur-sm">
                                    {generatedCL ? (
                                        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-7">
                                            {generatedCL}
                                        </pre>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                                            <FileText className="w-16 h-16 text-slate-500 mb-6" />
                                            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Ready to Generate</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end relative z-10">
                                    <button
                                        onClick={generateCoverLetter}
                                        disabled={isGenerating || !targetCompany || !targetRole}
                                        className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-all text-sm tracking-wide flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                    >
                                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                        {useAI ? 'Generate with Gemini' : 'Generate Template'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
