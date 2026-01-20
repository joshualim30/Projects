import { useState, useEffect } from 'react';
import { Search, Github, Globe, ExternalLink, Zap, Sparkles, RefreshCw } from 'lucide-react';
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
            <div className="flex flex-col items-center justify-center pt-8 pb-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-6"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    Discovery Hub
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 text-center"
                >
                    Find Your Next Role
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 text-lg font-medium max-w-xl mx-auto text-center leading-relaxed"
                >
                    Aggregating high-quality opportunities from GitHub community lists and intelligent direct ATS sourcing.
                </motion.p>
            </div>

            {/* Command Center Search */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-3xl mx-auto relative z-20"
            >
                <div className="relative group p-1 rounded-2xl bg-linear-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-2xl shadow-black/50">
                    <div className="bg-slate-950 rounded-xl p-2 flex items-center gap-3 relative overflow-hidden">
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
                                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all flex items-center gap-2 shadow-sm"
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
                <div className="flex items-center gap-6 mb-8 border-b border-slate-800 pb-1">
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
                                <div key={i} className="h-56 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
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
                                        className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden hover:border-indigo-500/50 transition-colors shadow-lg shadow-black/20"
                                    >
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-start justify-between mb-5">
                                                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2.5 shadow-inner">
                                                    {source === 'GitHub' ? <Github className="w-full h-full text-white" /> : <Globe className="w-full h-full text-indigo-400" />}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                                                    {date}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-white leading-tight mb-1 line-clamp-2">
                                                {title}
                                            </h3>
                                            <p className="text-sm font-medium text-slate-400 mb-6">{job.company}</p>

                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-auto">
                                                <Globe className="w-3.5 h-3.5" />
                                                {job.location}
                                            </div>

                                            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-800/50">
                                                <button
                                                    onClick={() => trackJob({
                                                        company: job.company,
                                                        role: title,
                                                        location: job.location,
                                                        link: link
                                                    })}
                                                    className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2"
                                                >
                                                    <Zap className="w-3.5 h-3.5" />
                                                    Track
                                                </button>
                                                <a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all"
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
                        <div className="text-center py-24 bg-slate-900 border border-slate-800 rounded-3xl">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-6">
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
