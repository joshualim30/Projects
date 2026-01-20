import { useState, useEffect } from 'react';
import {
    FileText, RefreshCw, Upload, Sparkles, ScanSearch,
    Wand2, Save, AlertCircle, CheckCircle, Target, Zap, LayoutDashboard,
    Key, Bot, BrainCircuit, X, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '../lib/supabase';
import { AppDocument } from '../types';
import { analyzeResume, ATSResult } from '../lib/ats';
import { initializeGemini, checkGeminiReady, analyzeResumeWithGemini, generateCoverLetterWithGemini } from '../lib/gemini';
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

    const handleAnalyze = async () => {
        if (!resumeText || !jobDescription) return;
        setIsAnalyzing(true);
        setActiveTab('analysis');

        try {
            if (useAI && checkGeminiReady()) {
                const aiResult = await analyzeResumeWithGemini(resumeText, jobDescription);
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
                    }
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
            if (useAI && checkGeminiReady()) {
                const profileContext = localStorage.getItem('user_profile_context');
                const parsedContext = profileContext ? JSON.parse(profileContext) : undefined;

                const letter = await generateCoverLetterWithGemini(resumeText, jobDescription, parsedContext);
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
        <div className="flex flex-col gap-6 relative pb-12 w-full max-w-7xl mx-auto">
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg shadow-black/20">
                        <ScanSearch className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Resume Lab</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI-Powered ATS</p>
                            <div className="h-3 w-px bg-slate-800"></div>
                            <button
                                onClick={() => !useAI ? setShowApiKeyModal(true) : setUseAI(!useAI)}
                                className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1.5 transition-all font-bold tracking-wide ${useAI
                                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
                                    }`}
                            >
                                {useAI ? <Bot className="w-3 h-3" /> : <BrainCircuit className="w-3 h-3" />}
                                {useAI ? 'GEMINI ACTIVE' : 'ENABLE AI'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
                    {['upload', 'analysis', 'cover-letter'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'upload' | 'analysis' | 'cover-letter')}
                            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all relative ${activeTab === tab
                                ? 'text-white'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-slate-800 rounded-lg shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.replace('-', ' ').toUpperCase()}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-[600px]">
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
                            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-1 flex flex-col relative group min-h-[600px] shadow-2xl shadow-black/20">
                                <div className="absolute top-4 right-4 z-20 flex gap-2">
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
                                            className="px-4 py-2 bg-slate-950 hover:bg-white text-slate-400 hover:text-black rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border border-slate-800 hover:border-white shadow-lg"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            Import File
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-950 rounded-[20px] relative overflow-hidden">
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
                                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col shadow-xl shadow-black/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Target className="w-4 h-4 text-indigo-400" /> Target Job
                                        </h3>
                                    </div>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste Job Description here..."
                                        className="flex-1 w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-slate-600 resize-none font-mono leading-relaxed transition-colors min-h-[200px]"
                                    />
                                </div>

                                <button
                                    disabled={isAnalyzing || !resumeText || !jobDescription}
                                    onClick={handleAnalyze}
                                    className={`h-16 rounded-2xl text-white font-bold text-sm tracking-wide hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 flex items-center justify-center gap-3 border border-white/10 relative overflow-hidden group ${useAI ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-800 hover:bg-slate-700'}`}
                                >
                                    {isAnalyzing ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {useAI ? <Sparkles className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                                            <span>{useAI ? 'Run Deep Scan' : 'Run Analysis'}</span>
                                        </>
                                    )}
                                </button>

                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex-1 min-h-[300px] shadow-xl shadow-black/20">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                                        <FileText className="w-4 h-4" /> History
                                        {loadingDocs && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                                    </h3>
                                    <div className="space-y-3">
                                        {documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                onClick={() => {
                                                    setResumeText(doc.content);
                                                }}
                                                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/30 cursor-pointer transition-all group relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${doc.type === 'resume' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                                                        }`}>
                                                        {doc.type}
                                                    </span>
                                                    <span className="text-[10px] text-slate-600 font-medium">{new Date(doc.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 font-medium truncate group-hover:text-slate-200 transition-colors mt-2">
                                                    {doc.name}
                                                </p>
                                            </div>
                                        ))}
                                        {documents.length === 0 && (
                                            <div className="text-center py-12 text-slate-600 text-xs font-medium">
                                                No saved documents
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'analysis' && analysisResult && (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Score Gauge */}
                            <div className="lg:col-span-3 flex flex-col gap-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] shadow-2xl shadow-black/40">
                                    <div className="absolute inset-0 bg-gradient-radial from-slate-800/20 to-transparent opacity-50"></div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                        className={`text-7xl font-black mb-4 tracking-tighter ${analysisResult.totalScore >= 75 ? 'text-emerald-400' :
                                            analysisResult.totalScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                                            }`}
                                    >
                                        {analysisResult.totalScore}
                                    </motion.div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Match Score</p>

                                    <div className="mt-8 flex flex-col gap-4 w-full">
                                        <div>
                                            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                                                <span>Keywords</span>
                                                <span>{analysisResult.details.keywords.score}/45</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(analysisResult.details.keywords.score / 45) * 100}%` }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                                                <span>Impact</span>
                                                <span>{analysisResult.details.impact.score}/25</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                                                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(analysisResult.details.impact.score / 25) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex-1 shadow-xl shadow-black/20">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-indigo-400" /> Executive Summary
                                    </h4>
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                        {analysisResult.feedback}
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Findings */}
                            <div className="lg:col-span-9 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/20">
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div>
                                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" /> Matched Keywords
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.details.keywords.found.map((k, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 rounded-lg text-xs font-mono font-medium">
                                                    {k}
                                                </span>
                                            ))}
                                            {analysisResult.details.keywords.found.length === 0 && (
                                                <span className="text-slate-600 text-xs font-medium">No direct matches found.</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <Target className="w-4 h-4" /> Missing Keywords
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.details.keywords.missing.map((k, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-rose-500/5 text-rose-400 border border-rose-500/10 rounded-lg text-xs font-mono font-medium opacity-80 hover:opacity-100 transition-opacity cursor-help">
                                                    {k}
                                                </span>
                                            ))}
                                            {analysisResult.details.keywords.missing.length === 0 && (
                                                <span className="text-slate-600 text-xs font-medium">All keywords matched.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-10 border-t border-slate-800 grid md:grid-cols-2 gap-12">
                                    <div>
                                        <h4 className="text-xs font-black text-violet-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <Zap className="w-4 h-4" /> Impact Metrics
                                        </h4>
                                        <div className="space-y-3">
                                            {analysisResult.details.impact.metricsFound.map((m, i) => (
                                                <div key={i} className="flex items-center gap-3 text-xs text-slate-400 font-mono bg-slate-950 px-4 py-3 rounded-xl border border-slate-800/50">
                                                    <span className="w-5 h-5 rounded-md bg-violet-500/10 text-violet-400 flex items-center justify-center text-[10px] font-bold">#</span>
                                                    {m}
                                                </div>
                                            ))}
                                            {analysisResult.details.impact.metricsFound.length === 0 && (
                                                <span className="text-slate-600 text-xs font-medium">No quantifiable metrics detected.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <LayoutDashboard className="w-4 h-4" /> Formatting Check
                                        </h4>
                                        <div className="space-y-3">
                                            {analysisResult.details.formatting.missingSections.length > 0 ? (
                                                analysisResult.details.formatting.missingSections.map(s => (
                                                    <div key={s} className="text-xs text-rose-400 flex items-center gap-3 bg-rose-500/5 px-4 py-3 rounded-xl border border-rose-500/10">
                                                        <AlertCircle className="w-4 h-4" /> Missing: <span className="font-bold uppercase">{s}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-xs text-emerald-400 flex items-center gap-3 bg-emerald-500/5 px-4 py-3 rounded-xl border border-emerald-500/10">
                                                    <CheckCircle className="w-4 h-4" /> All Value Sections Present
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'cover-letter' && (
                        <motion.div
                            key="cl"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            <div className="lg:col-span-8 lg:col-start-3 bg-slate-900 border border-slate-800 rounded-3xl p-10 flex flex-col shadow-2xl shadow-black/40 relative">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                            <Wand2 className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                                Cover Letter
                                                {useAI && <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold tracking-wide">AI ENABLED</span>}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Smart Generator</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => saveDocument(`${targetCompany || 'Draft'} CL`, 'cover_letter', generatedCL)}
                                        disabled={!generatedCL}
                                        className="text-xs font-bold text-emerald-400 flex items-center gap-2 hover:bg-emerald-500/10 px-4 py-2 rounded-xl transition-all disabled:opacity-0"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save to Documents
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Company Name</label>
                                        <input
                                            type="text"
                                            value={targetCompany}
                                            onChange={(e) => setTargetCompany(e.target.value)}
                                            placeholder="e.g. Acme Corp"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Job Title</label>
                                        <input
                                            type="text"
                                            value={targetRole}
                                            onChange={(e) => setTargetRole(e.target.value)}
                                            placeholder="e.g. Senior Developer"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 relative p-8 overflow-y-auto min-h-[400px] mb-6">
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

                                <div className="flex justify-end">
                                    <button
                                        onClick={generateCoverLetter}
                                        disabled={isGenerating || !targetCompany || !targetRole}
                                        className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-all text-sm tracking-wide flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
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

