import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Globe, Lock, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface BrowserTab {
    id: string;
    url: string;
    title: string;
    isLoading: boolean;
    canGoBack: boolean;
    canGoForward: boolean;
}

export const Discovery = () => {
    const [tabs, setTabs] = useState<BrowserTab[]>([
        { id: '1', url: 'https://www.google.com', title: 'New Tab', isLoading: false, canGoBack: false, canGoForward: false }
    ]);
    const [activeTabId, setActiveTabId] = useState<string>('1');
    const [urlInput, setUrlInput] = useState('https://www.google.com'); // text input for the active tab

    // Map tab IDs to webview refs
    const webviewRefs = useRef<{ [key: string]: any }>({});

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    // Update URL bar when active tab changes or its URL updates
    useEffect(() => {
        if (activeTab) {
            setUrlInput(activeTab.url);
        }
    }, [activeTabId, activeTab?.url]);

    const createTab = () => {
        const newId = Date.now().toString();
        const newTab: BrowserTab = {
            id: newId,
            url: 'https://www.google.com',
            title: 'New Tab',
            isLoading: false,
            canGoBack: false,
            canGoForward: false
        };
        setTabs([...tabs, newTab]);
        setActiveTabId(newId);
    };

    const closeTab = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (tabs.length === 1) {
            // Don't close the last tab, just reset it
            setTabs([{ ...tabs[0], url: 'https://www.google.com', title: 'New Tab' }]);
            return;
        }

        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);

        if (id === activeTabId) {
            // If we closed the active tab, switch to the last one
            setActiveTabId(newTabs[newTabs.length - 1].id);
        }
    };

    const updateTab = (id: string, updates: Partial<BrowserTab>) => {
        setTabs(prev => prev.map(tab => tab.id === id ? { ...tab, ...updates } : tab));
    };

    const handleNavigate = () => {
        let target = urlInput;
        if (!target.startsWith('http://') && !target.startsWith('https://')) {
            if (target.includes('.') && !target.includes(' ')) {
                target = `https://${target}`;
            } else {
                target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
            }
        }

        const webview = webviewRefs.current[activeTabId];
        if (webview) {
            webview.loadURL(target);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleNavigate();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] w-full max-w-full overflow-hidden rounded-2xl bg-black/40 border border-white/5 shadow-2xl backdrop-blur-sm">

            {/* Tab Bar */}
            <div className="flex items-center bg-black/40 border-b border-white/5 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={cn(
                            "group flex items-center gap-2 px-4 py-2.5 min-w-[160px] max-w-[240px] border-r border-white/5 cursor-pointer transition-all select-none",
                            tab.id === activeTabId ? "bg-white/10 text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                        )}
                    >
                        {tab.isLoading ? (
                            <RotateCw className="w-3 h-3 animate-spin text-indigo-400" />
                        ) : (
                            <Globe className="w-3 h-3 opacity-50" />
                        )}
                        <span className="text-xs font-medium truncate flex-1">{tab.title}</span>
                        <button
                            onClick={(e) => closeTab(e, tab.id)}
                            className="p-0.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                <button
                    onClick={createTab}
                    className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 transition-colors border-r border-white/5"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Browser Toolbar (Controls for Active Tab) */}
            <div className="flex items-center gap-3 p-3 bg-white/5 border-b border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => webviewRefs.current[activeTabId]?.goBack()}
                        disabled={!activeTab.canGoBack}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => webviewRefs.current[activeTabId]?.goForward()}
                        disabled={!activeTab.canGoForward}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => webviewRefs.current[activeTabId]?.reload()}
                        className={cn(
                            "p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors",
                            activeTab.isLoading && "animate-spin text-indigo-400"
                        )}
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        {activeTab.url.startsWith('https') ? <Lock className="w-3.5 h-3.5 text-emerald-400" /> : <Globe className="w-3.5 h-3.5 text-slate-500" />}
                    </div>
                    <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-black/20 hover:bg-black/30 text-white text-sm rounded-xl px-4 pl-9 py-2.5 border border-white/5 focus:border-indigo-500/50 focus:bg-black/40 focus:outline-none transition-all font-mono"
                        placeholder="Search Google or enter a URL"
                    />
                </div>
            </div>

            {/* Webviews Container */}
            <div className="flex-1 relative bg-white">
                {tabs.map(tab => (
                    <webview
                        key={tab.id}
                        ref={(el: any) => {
                            if (el) {
                                webviewRefs.current[tab.id] = el;

                                // Attach listeners only once
                                // Note: In React strict mode or re-renders, this might attach multiple times if not careful.
                                // A cleaner way is typically wrapping this in a useEffect or a customized component.
                                // For simplicity in this file, we'll assign the on-event handlers directly if supported,
                                // or add event listeners if they are not already attached.
                                // However, webview tag events are DOM events.

                                const handleStart = () => updateTab(tab.id, { isLoading: true });
                                const handleStop = () => updateTab(tab.id, { isLoading: false });
                                const handleDomReady = () => {
                                    updateTab(tab.id, {
                                        canGoBack: el.canGoBack(),
                                        canGoForward: el.canGoForward(),
                                        title: el.getTitle(),
                                        url: el.getURL()
                                    });
                                    if (tab.id === activeTabId) {
                                        setUrlInput(el.getURL());
                                    }
                                };
                                const handleNewWindow = (e: any) => {
                                    // Open new window in a new tab
                                    const newId = Date.now().toString();
                                    const newTab: BrowserTab = {
                                        id: newId,
                                        url: e.url,
                                        title: 'New Tab',
                                        isLoading: true,
                                        canGoBack: false,
                                        canGoForward: false
                                    };
                                    setTabs(prev => [...prev, newTab]);
                                    setActiveTabId(newId);
                                };

                                // Remove old listeners to prevent duplicates (rudimentary cleanup)
                                el.removeEventListener('did-start-loading', handleStart);
                                el.removeEventListener('did-stop-loading', handleStop);
                                el.removeEventListener('dom-ready', handleDomReady);
                                el.removeEventListener('new-window', handleNewWindow);

                                el.addEventListener('did-start-loading', handleStart);
                                el.addEventListener('did-stop-loading', handleStop);
                                el.addEventListener('dom-ready', handleDomReady);
                                el.addEventListener('new-window', handleNewWindow);
                            }
                        }}
                        src={tab.url}
                        className="w-full h-full"
                        style={{ display: tab.id === activeTabId ? 'flex' : 'none' }}
                        allowpopups={true}
                        partition="persist:discovery" // Keeps cookies/session persistent
                    />
                ))}
            </div>
        </div>
    );
};
