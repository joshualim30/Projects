import { FileText, Mail, Menu, ChevronLeft, FolderCodeIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getResumeUrl } from '../../services/storage';
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';
import Picture from '../../../public/headshot.jpg';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchResume = async () => {
            const url = await getResumeUrl();
            setResumeUrl(url);
        };
        fetchResume();
    }, []);

    const handleShare = async () => {
        const shareData = {
            title: 'Joshua Lim Portfolio',
            text: 'Check out Joshua Lim\'s portfolio!',
            url: 'https://joshualim.me',
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert('URL copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-20 p-2 bg-white dark:bg-[#1E1F20] rounded-lg text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-[#444746]"
            >
                <Menu size={24} />
            </button>

            {/* Sidebar Container */}
            <div
                className={`fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-[#1E1F20] border-r border-gray-200 dark:border-[#444746] z-40 flex flex-col p-6 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'
                    }`}
            >
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <img
                            src={Picture}
                            alt="Joshua Lim"
                            className="w-10 h-10 rounded-full border border-gray-200 dark:border-[#444746]"
                        />
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold text-black dark:text-white">
                                Joshua Lim
                            </h2>
                            <TypingRole
                                roles={["Software Engineer", "Student", "Business Analyst"]}
                            />
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-600 dark:text-[#C4C7C5]">
                        <ChevronLeft size={24} />
                    </button>
                </div>

                <div className="flex-1 space-y-2">
                    <h3 className="text-xs font-semibold text-gray-600 dark:text-[#8E918F] uppercase tracking-wider mb-4">Quick Links</h3>
                    <SidebarItem
                        icon={<FileText size={16} />}
                        label="View Resume"
                        href={resumeUrl || '#'}
                        target="_blank"
                        onClick={() => !resumeUrl && alert("Resume loading or not found.")}
                    />
                    <SidebarItem
                        icon={<FolderCodeIcon size={16} />}
                        label="My Projects"
                        href="https://github.com/joshualim30/projects"
                        target="_blank"
                    />
                </div>

                <div className="mt-auto">
                    <h3 className="text-xs font-semibold text-gray-600 dark:text-[#8E918F] uppercase tracking-wider mb-4">Socials</h3>
                    <div className="space-y-2 mb-4">
                        <SidebarItem
                            icon={<GitHubLogoIcon />}
                            label="GitHub"
                            href="https://github.com/joshualim30/"
                            target="_blank"
                        />
                        <SidebarItem
                            icon={<LinkedInLogoIcon />}
                            label="LinkedIn"
                            href="https://linkedin.com/in/joshualim30"
                            target="_blank"
                        />
                        <SidebarItem
                            icon={<Mail size={16} />}
                            label="Email"
                            href="mailto:hi@joshualim.me"
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-[#444746]">
                        <div className="flex flex-col gap-2 text-[11px] text-gray-500 dark:text-[#8E918F]">
                            <p>Powered by Gemini 2.5 Flash</p>
                            <div className="flex gap-2">
                                <a href="https://gemini.google/about/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-[#E3E3E3] transition-colors">About Gemini</a>
                                <span>•</span>
                                <button onClick={handleShare} className="hover:text-gray-900 dark:hover:text-[#E3E3E3] transition-colors">Share Website!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 dark:bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    href?: string;
    target?: string;
}

const SidebarItem = ({ icon, label, onClick, href, target }: SidebarItemProps) => {
    const className = "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-900 dark:text-[#E3E3E3] hover:bg-gray-100 dark:hover:bg-[#2D2E2F] transition-colors text-left";

    if (href) {
        return (
            <a
                href={href}
                target={target}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                className={className}
                onClick={onClick}
            >
                <span className="text-gray-600 dark:text-[#C4C7C5]">{icon}</span>
                <span className="font-medium text-sm">{label}</span>
            </a>
        );
    }

    return (
        <button
            onClick={onClick}
            className={className}
        >
            <span className="text-gray-600 dark:text-[#C4C7C5]">{icon}</span>
            <span className="font-medium text-sm">{label}</span>
        </button>
    );
};

const TypingRole = ({ roles }: { roles: string[] }) => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % roles.length;
            const fullText = roles[i];

            setText(isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            setTypingSpeed(isDeleting ? 30 : 150);

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, roles, typingSpeed]);

    return (
        <p className="text-sm text-gray-600 dark:text-[#C4C7C5] h-5">
            {text}
            <span className="animate-pulse">|</span>
        </p>
    );
};
