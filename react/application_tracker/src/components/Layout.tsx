import { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, Mail, Settings as SettingsIcon, LogOut, Search, FileText, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';
import { signInWithGoogle, logout, getFirebaseUser, initFirebase } from '../lib/firebase';
import { ChatBot } from './ChatBot';

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    tab: string;
    activeTab: string;
    onClick: (tab: string) => void;
}

const NavItem = ({ icon: Icon, label, tab, activeTab, onClick }: NavItemProps) => {
    const active = activeTab === tab;
    return (
        <button
            onClick={() => onClick(tab)}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group w-full text-left relative overflow-hidden",
                active
                    ? "text-white bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
        >
            {active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#6366f1]" />
            )}
            <Icon className={cn("w-5 h-5 relative z-10 transition-colors", active ? "text-primary" : "group-hover:text-white")} />
            <span className={cn("font-medium relative z-10 tracking-wide text-sm", active ? "text-white" : "")}>{label}</span>
        </button>
    );
};

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) => {
    const [user, setUser] = useState<import('firebase/auth').User | null>(null);

    useEffect(() => {
        const init = async () => {
            await initFirebase();
            setUser(getFirebaseUser());
        };
        init();
    }, []);

    const handleAuth = async () => {
        if (user) {
            await logout();
            setUser(null);
        } else {
            try {
                const newUser = await signInWithGoogle();
                setUser(newUser);
            } catch (err) {
                console.error(err);
                alert('Please configure Firebase in Settings first!');
            }
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden transition-opacity duration-500",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <div className={cn(
                "fixed top-0 left-0 h-screen bg-app-bg border-r border-white/5 flex flex-col p-6 pt-16 z-50 transition-transform duration-500 cubic-[0.32, 0.72, 0, 1] w-72 md:translate-x-0 shadow-2xl md:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Drag Region for macOS */}
                <div className="absolute top-0 left-0 right-0 h-16 w-full -z-10" style={{ WebkitAppRegion: 'drag' } as any} />

                {/* Logo Area */}
                <div className="flex items-center gap-4 mb-12 px-2">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                        <div className="w-10 h-10 rounded-xl bg-app-card flex items-center justify-center border border-white/10 relative z-10">
                            <div className="w-5 h-5 bg-linear-to-tr from-primary to-[#a855f7] rounded-md"></div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white tracking-widest uppercase">
                            APPLICATION
                        </h1>
                        <p className="text-[10px] font-medium text-slate-500 tracking-wider">
                            TRACKER
                        </p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    <div className="px-4 pb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Main</div>
                    <NavItem tab="dashboard" icon={LayoutDashboard} label="Dashboard" activeTab={activeTab} onClick={setActiveTab} />
                    <NavItem tab="applications" icon={Briefcase} label="Applications" activeTab={activeTab} onClick={setActiveTab} />

                    <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Tools</div>
                    <NavItem tab="resume" icon={FileText} label="Resume Lab" activeTab={activeTab} onClick={setActiveTab} />
                    <NavItem tab="discovery" icon={Search} label="Discovery" activeTab={activeTab} onClick={setActiveTab} />
                    <NavItem tab="emails" icon={Mail} label="Emails" activeTab={activeTab} onClick={setActiveTab} />

                    <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">System</div>
                    <NavItem tab="settings" icon={SettingsIcon} label="Settings" activeTab={activeTab} onClick={setActiveTab} />
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5">
                    {user ? (
                        <div className="group relative p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 flex items-center gap-3">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className="flex-1 flex items-center gap-3 min-w-0 text-left cursor-pointer"
                            >
                                <img
                                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                    className="w-9 h-9 rounded-full border border-white/10 object-cover bg-black"
                                    alt="Avatar"
                                />
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-white truncate group-hover:text-primary transition-colors">{user.displayName || 'User'}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                                </div>
                            </button>
                            <button
                                onClick={handleAuth}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAuth}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl w-full font-semibold text-xs border border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.5)]"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Sign In</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export const AppLayout = ({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-app-bg text-slate-200 selection:bg-primary/30 overflow-hidden flex">
            {/* Mobile Header Trigger */}
            <div className="md:hidden fixed top-0 left-0 w-full p-4 z-30 flex items-center justify-between pointer-events-none">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="w-10 h-10 rounded-xl bg-app-card/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto shadow-lg"
                >
                    <LayoutDashboard className="w-5 h-5" />
                </button>
            </div>

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            <ChatBot activeTab={activeTab} />

            <main className="flex-1 md:ml-72 h-screen overflow-hidden relative">
                {/* Drag Region for macOS */}
                <div className="absolute top-0 left-0 right-0 h-8 w-full z-50" style={{ WebkitAppRegion: 'drag' } as any} />

                {/* Background Ambient Glows */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] pointer-events-none opacity-30 mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#a855f7]/10 rounded-full blur-[128px] pointer-events-none opacity-30 mix-blend-screen" />

                <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-10 pt-24 md:pt-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
