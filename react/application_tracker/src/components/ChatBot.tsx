import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Sparkles, Cpu, Layers, Zap, X } from 'lucide-react';
import { generateChatCompletion, ChatMessage } from '../lib/ai';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { getFirebaseUser } from '../lib/firebase';
import { getSupabaseClient } from '../lib/supabase';
import { UserProfile } from './Profile';
import { AppDocument } from '../types';
import { AppStorage } from '../lib/storage';

interface ChatBotProps {
    activeTab: string;
}

export const ChatBot = ({ activeTab }: ChatBotProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [thinkingStep, setThinkingStep] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // AI Configuration
    const [aiProvider, setAiProvider] = useState<string>('gemini');
    const [aiModel, setAiModel] = useState<string>('gemini-pro');

    // Context Data
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [documents, setDocuments] = useState<AppDocument[]>([]);

    useEffect(() => {
        const loadSettings = async () => {
            const provider = await AppStorage.getItem('AI_PROVIDER') || 'gemini';
            const model = provider === 'ollama'
                ? (await AppStorage.getItem('OLLAMA_MODEL') || 'llama3')
                : 'Gemini Pro';
            setAiProvider(provider);
            setAiModel(model);
        };

        if (isOpen) {
            loadSettings();
            loadContextData();
        }
    }, [isOpen]);

    const loadContextData = async () => {
        // 1. Load Profile (LocalStorage first for speed)
        const savedProfile = localStorage.getItem('user_profile_context');
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        } else {
            // Try Supabase if not in local
            const user = getFirebaseUser();
            const client = await getSupabaseClient();
            if (user && client) {
                const { data } = await client.from('user_profiles').select('*').eq('user_id', user.uid).single();
                if (data) setProfile(data);
            }
        }

        // 2. Load Documents Header
        const client = await getSupabaseClient();
        if (client) {
            const { data } = await client.from('documents').select('id, name, type, created_at, content').order('created_at', { ascending: false });
            if (data) setDocuments(data as AppDocument[]);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, thinkingStep]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { role: 'assistant', content: `Hi! I'm ready to help. I have access to your **${activeTab}** context.` }
            ]);
        }
    }, [activeTab, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setThinkingStep('Analyzing input...');

        try {
            // Simulation of "Thought Process"
            const steps = [
                'Reading page context...',
                profile ? 'Consulting User Profile...' : 'Checking Profile...',
                documents.length > 0 ? `Scanning ${documents.length} documents...` : 'Checking documents...',
                `Generating response with ${aiModel}...`
            ];

            let stepIndex = 0;
            const stepInterval = setInterval(() => {
                if (stepIndex < steps.length) {
                    setThinkingStep(steps[stepIndex]);
                    stepIndex++;
                }
            }, 800);

            // Construct enhanced context
            let context = `User is currently viewing the ${activeTab} page.\n\n`;

            if (profile) {
                context += `USER PROFILE CONTEXT:\n`;
                if (profile.bio) context += `Bio: ${profile.bio}\n`;
                if (profile.experience_summary) context += `Experience: ${profile.experience_summary}\n`;
                if (profile.skills) context += `Skills: ${profile.skills}\n`;
                if (profile.key_achievements) context += `Achievements: ${profile.key_achievements}\n`;
                context += `\n`;
            }

            if (documents.length > 0) {
                context += `AVAILABLE DOCUMENTS (User has these on file):\n`;
                documents.forEach(doc => {
                    const snippet = doc.content ? doc.content.substring(0, 300).replace(/\n/g, ' ') + "..." : "No content";
                    context += `- [${doc.type.toUpperCase()}] ${doc.name} (${new Date(doc.created_at).toLocaleDateString()}): ${snippet}\n`;
                });
                context += `\n`;
            }

            const responseText = await generateChatCompletion([...messages, userMessage], context);

            clearInterval(stepInterval);
            setThinkingStep(null);
            setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
        } catch (error) {
            console.error(error);
            setThinkingStep(null);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the AI provider. Please check your Settings." }]);
        } finally {
            setIsLoading(false);
            setThinkingStep(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed right-0 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 backdrop-blur-md border-l border-t border-b border-white/20 rounded-l-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-all group",
                    isOpen ? "translate-x-full" : "translate-x-0"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageSquare className="w-6 h-6 text-white relative z-10" />
            </motion.button>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for mobile closing */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Main Sidebar */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 bottom-0 right-0 z-50 w-full md:w-[450px] bg-[#0A0A0A]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 to-purple-500/10" />
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/20">
                                        <Bot className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg tracking-tight">AI Assistant</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[10px] font-medium text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Cpu className="w-3 h-3 text-indigo-400" />
                                                {aiModel}
                                            </span>
                                            {aiProvider === 'ollama' && (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
                                                    Local
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors relative z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/40">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex gap-4 max-w-[95%]",
                                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-full shrink-0 flex items-center justify-center border shadow-sm mt-1",
                                            msg.role === 'user'
                                                ? "bg-slate-800 border-slate-700 text-slate-300"
                                                : "bg-indigo-600 border-indigo-500 text-white"
                                        )}>
                                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                        </div>

                                        <div className="flex flex-col gap-1 min-w-0">
                                            <div className={cn(
                                                "p-4 rounded-2xl text-sm leading-relaxed shadow-md border",
                                                msg.role === 'user'
                                                    ? "bg-slate-800/80 border-slate-700/50 text-slate-100 rounded-tr-sm"
                                                    : "bg-white/10 border-white/5 text-slate-200 rounded-tl-sm backdrop-blur-sm"
                                            )}>
                                                <div className="prose prose-invert prose-sm max-w-none">
                                                    <ReactMarkdown>
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                            {msg.role === 'assistant' && (
                                                <span className="text-[10px] text-slate-500 font-medium px-2 opacity-50">
                                                    {aiModel}
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Thinking State */}
                                {isLoading && thinkingStep && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-4 max-w-[85%]"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shrink-0 flex items-center justify-center mt-1">
                                            <Layers className="w-4 h-4 animate-pulse" />
                                        </div>
                                        <div className="bg-white/5 rounded-2xl rounded-tl-sm p-4 border border-white/5 flex flex-col gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>
                                                <span className="text-xs font-medium text-emerald-400 animate-pulse">{thinkingStep}</span>
                                            </div>
                                            {/* Fake Progress lines */}
                                            <div className="space-y-1.5 opacity-30">
                                                <div className="h-1.5 w-24 bg-slate-600 rounded-full animate-pulse" />
                                                <div className="h-1.5 w-16 bg-slate-600 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-black/60 border-t border-white/5 backdrop-blur-xl supports-[backdrop-filter]:bg-black/40">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={`Message ${aiModel}...`}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 relative z-10 resize-none min-h-[60px] max-h-[200px] custom-scrollbar shadow-inner"
                                        rows={1}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className="absolute right-2 bottom-2 z-20 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg disabled:opacity-0 disabled:scale-90 transition-all duration-200 hover:shadow-indigo-500/25 active:scale-95"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-3 opacity-40 hover:opacity-100 transition-opacity">
                                    <Zap className="w-3 h-3 text-amber-400" />
                                    <span className="text-[10px] text-slate-400">Context Active: Profile &bull; {documents.length} Docs &bull; {activeTab}</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
