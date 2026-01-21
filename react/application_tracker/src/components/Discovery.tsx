import { useState, useEffect } from 'react';
import { Search, Github, Globe, ExternalLink, Zap, Sparkles, RefreshCw, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Internship {
    company: string;
    role: string;
    location: string;
    link: string;
    date?: string;
    source?: string;
}

interface SearchResult {
    id: string;
    title: string;
    company: string;
    location: string;
    url: string;
    source: 'Greenhouse' | 'Lever' | 'Ashby' | 'Google' | 'GitHub';
    posted_at: string;
}

export const Discovery = () => {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'curated'>('all');

    useEffect(() => {
        fetchInternships();
    }, []);

    const trackJob = (job: Internship) => {
        const jobData = {
            company_name: job.company,
            title: job.role,
            company_location: job.location,
            application_url: job.link,
            status: 'applied'
        };
        window.dispatchEvent(new CustomEvent('trackJob', { detail: jobData }));
    };

    const fetchInternships = async () => {
        setLoading(true);
        const sourceUrl = localStorage.getItem('GITHUB_SOURCE_URL') || 'https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/dev/.github/scripts/data.json';
        try {
            const response = await fetch(sourceUrl);
            if (response.ok) {
                const data = await response.json();
                const mapped = data.map((item: { company_name: string; title: string; location: string; url: string; date_posted?: string }) => ({
                    company: item.company_name,
                    role: item.title,
                    location: item.location,
                    link: item.url,
                    date: item.date_posted,
                    source: 'GitHub'
                })).slice(0, 50);
                setInternships(mapped);
            } else {
                setInternships([]);
            }
        } catch (error) {
            console.error('Error fetching internships:', error);
            setInternships([]);
        }
        setLoading(false);
    };

    const performSmartSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        setSearchResults([]);

        // Integrated Search: GitHub + Dorking
        setTimeout(() => {
            // Filter GitHub results
            const githubMatches: SearchResult[] = internships
                .filter(job => job.role.toLowerCase().includes(searchQuery.toLowerCase()) || job.company.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, 100) // Increased limit to show more results
                .map((job, idx) => ({
                    id: `gh-${idx}`,
                    title: job.role,
                    company: job.company,
                    location: job.location,
                    url: job.link,
                    source: 'GitHub',
                    posted_at: job.date ? new Date(job.date).toLocaleDateString() : 'Recently'
                }));

            setSearchResults(githubMatches);
            setIsSearching(false);
        }, 800);
    };

    const getDorkQueries = () => {
        const targets = localStorage.getItem('DORKING_TARGETS')?.split(',').map(t => t.trim()) || ['Greenhouse', 'Lever', 'Ashby', 'Workable'];
        return targets.map(target => ({
            label: `${target}`,
            query: `site:jobs.${target.toLowerCase()}.com OR site:boards.${target.toLowerCase()}.io "${searchQuery || 'software engineer'}"`,
            target: target.toUpperCase()
        }));
    };

    const dorkQueries = getDorkQueries();

    return (
        <div className="flex flex-col gap-6 relative pb-12 w-full max-w-7xl mx-auto px-4 md:px-8">
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-4 mb-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-2 shadow-sm backdrop-blur-md"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Discovery Hub
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white tracking-tighter glow-text"
                    >
                        Find Your Next Role
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium text-lg mt-2"
                    >
                        Aggregating high-quality opportunities from GitHub & ATS.
                    </motion.p>
                </div>
            </div>

            {/* Command Center Search */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-3xl mx-auto relative z-20"
            >
                <div className="relative group p-1 rounded-2xl bg-linear-to-br from-primary/20 via-slate-800/50 to-slate-900/50 border border-white/10 shadow-[0_0_50px_rgba(79,70,229,0.15)] backdrop-blur-xl">
                    <div className="bg-slate-950/80 rounded-xl p-2 flex items-center gap-3 relative overflow-hidden backdrop-blur-md">
                        <div className="pl-4">
                            <Search className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-transparent text-lg font-medium text-white placeholder:text-slate-600 focus:outline-none h-12 font-mono"
                            placeholder="Role, company, or keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && performSmartSearch()}
                        />
                        <button
                            onClick={performSmartSearch}
                            disabled={isSearching}
                            className="bg-white hover:bg-slate-200 text-black rounded-lg px-6 h-10 font-bold transition-all shadow-lg shadow-white/5 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
                        >
                            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Search</span>}
                        </button>
                    </div>
                </div>

                {/* Quick Actions / Dorking Links */}
                {searchQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 flex flex-wrap justify-center gap-3"
                    >
                        {dorkQueries.map((dork) => (
                            <a
                                key={dork.target}
                                href={`https://www.google.com/search?q=${encodeURIComponent(dork.query)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all flex items-center gap-2 shadow-sm backdrop-blur-sm"
                            >
                                <ExternalLink className="w-3 h-3" />
                                {dork.label}
                            </a>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* Results Section */}
            <div className="w-full mt-8">
                <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-1">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`text-sm font-bold pb-4 -mb-1.5 border-b-2 transition-all ${activeTab === 'all' ? 'text-white border-indigo-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                    >
                        Latest Opportunities
                    </button>
                    {/* Add more tabs here if needed */}
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-56 glass-card rounded-2xl animate-pulse bg-white/5" />
                            ))}
                        </div>
                    ) : (searchResults.length > 0 || internships.length > 0) ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {(searchResults.length > 0 ? searchResults : internships).map((job: Internship | SearchResult, idx) => {
                                const title = 'title' in job ? job.title : job.role;
                                const link = 'url' in job ? job.url : job.link;
                                const date = 'posted_at' in job ? job.posted_at : (job.date || 'Now');
                                const source = 'source' in job ? job.source : 'GitHub';

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ y: -4 }}
                                        className="group relative glass-card rounded-2xl p-6 overflow-hidden hover:border-indigo-500/30 transition-all"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-start justify-between mb-5">
                                                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-2.5 shadow-inner backdrop-blur-sm group-hover:border-indigo-500/30 transition-colors">
                                                    {source === 'GitHub' ? <Github className="w-full h-full text-white" /> : <Globe className="w-full h-full text-indigo-400" />}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-black/40 px-2 py-1 rounded-md border border-white/5 group-hover:border-white/10 transition-colors">
                                                    {date}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-white leading-tight mb-1 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                                                {title}
                                            </h3>
                                            <p className="text-sm font-medium text-slate-400 mb-6 flex items-center gap-2">
                                                <Briefcase className="w-3.5 h-3.5" />
                                                {job.company}
                                            </p>

                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-auto">
                                                <Globe className="w-3.5 h-3.5" />
                                                {job.location}
                                            </div>

                                            <div className="flex gap-3 mt-6 pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors">
                                                <button
                                                    onClick={() => trackJob({
                                                        company: job.company,
                                                        role: title,
                                                        location: job.location,
                                                        link: link
                                                    })}
                                                    className="flex-1 py-2.5 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
                                                >
                                                    <Zap className="w-3.5 h-3.5" />
                                                    Track
                                                </button>
                                                <a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all hover:bg-white/5"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <div className="text-center py-24 glass-card rounded-3xl">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6 border border-white/5">
                                <Search className="w-8 h-8 text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No opportunities found</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Try adjusting your search keywords or checking back later for more updates.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
