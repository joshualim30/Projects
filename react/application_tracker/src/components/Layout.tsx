import { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, Mail, Settings as SettingsIcon, LogOut, Search, FileText, LogIn, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { signInWithGoogle, logout, getFirebaseUser, initFirebase } from '../lib/firebase';

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
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full text-left relative overflow-hidden",
                active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            )}
        >
            {active && <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent w-full h-full -skew-x-12 -translate-x-full animate-shimmer" />}
            <Icon className={cn("w-5 h-5 relative z-10", active ? "text-white" : "group-hover:text-slate-100")} />
            <span className="font-medium relative z-10">{label}</span>
        </button>
    );
};

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps & { isOpen?: boolean, onClose?: () => void }) => {
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
                    "fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <div className={cn(
                "fixed top-0 left-0 h-screen bg-slate-950 border-r border-slate-900 flex flex-col p-6 z-50 transition-transform duration-300 w-64 md:translate-x-0 shadow-2xl md:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between mb-10 px-2 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-xl overflow-hidden shadow-indigo-500/10">
                            <img src="/app_icon.png" alt="Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <div>
                            <h1 className="text-xs font-black text-white tracking-[0.2em] uppercase leading-tight">
                                Application
                            </h1>
                            <h1 className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase leading-tight">
                                Tracker
                            </h1>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    <NavItem tab="dashboard" icon={LayoutDashboard} label="Dashboard" activeTab={activeTab} onClick={setActiveTab} />
                    <NavItem tab="applications" icon={Briefcase} label="Applications" activeTab={activeTab} onClick={setActiveTab} />
                    <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-600 uppercase tracking-widest">Tools</div>
                    <NavItem tab="profile" icon={User} label="My Profile" activeTab={activeTab} onClick={setActiveTab} />
                    <NavItem tab="resume" icon={FileText} label="Resume Lab" activeTab={activeTab} onClick={setActiveTab} />
                    <NavItem tab="discovery" icon={Search} label="Discovery" activeTab={activeTab} onClick={setActiveTab} />
                    <NavItem tab="emails" icon={Mail} label="Emails" activeTab={activeTab} onClick={setActiveTab} />
                    <NavItem tab="settings" icon={SettingsIcon} label="Settings" activeTab={activeTab} onClick={setActiveTab} />
                </nav>

                <div className="mt-auto pt-4 border-t border-slate-800/50">
                    {user ? (
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg shadow-black/20">
                            <img
                                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                className="w-10 h-10 rounded-full border border-slate-700 object-cover bg-slate-950 shrink-0"
                                alt="Avatar"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">{user.displayName || 'User'}</p>
                                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                            </div>
                            <button
                                onClick={handleAuth}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAuth}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 w-full text-left font-medium border border-indigo-500/20 bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                        >
                            <LogIn className="w-5 h-5" />
                            <span>Sign In with Google</span>
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
        <div className="min-h-screen bg-slate-950 flex relative font-sans text-slate-200 selection:bg-indigo-500/30">
            {/* Mobile Header Trigger */}
            <div className="md:hidden fixed top-0 left-0 w-full p-4 z-30 flex items-center justify-between pointer-events-none">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white pointer-events-auto shadow-xl"
                >
                    <LayoutDashboard className="w-6 h-6" />
                </button>
            </div>

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            <main
                className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen overflow-y-auto relative scroll-smooth pt-20 md:pt-8"
            >
                <div className="w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
