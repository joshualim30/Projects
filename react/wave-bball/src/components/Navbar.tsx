import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../assets/logo.jpg';

const navLinks = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const SiteNavbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    React.useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? 'bg-[#080E1A]/95 backdrop-blur-xl border-b border-white/[0.06] py-3'
                    : 'bg-[#080E1A]/70 backdrop-blur-md py-4 sm:py-5'
            }`}>
                <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5 group relative z-[51]">
                        <img
                            src={Logo}
                            alt="Wave Basketball"
                            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-1 ring-white/10 group-hover:ring-wave-blue/40 transition-all duration-300"
                        />
                        <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                            WAVE
                        </span>
                    </a>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.04]"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="/contact"
                            className="ml-4 px-5 py-2 text-sm font-medium rounded-full bg-wave-blue text-white hover:bg-wave-blue/90 transition-all duration-200 hover:shadow-lg hover:shadow-wave-blue/20"
                        >
                            Get in Touch
                        </a>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden relative z-[51] p-2 -mr-2 text-gray-400 hover:text-white transition-colors active:scale-95"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile overlay menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-40 bg-[#080E1A] md:hidden flex flex-col"
                    >
                        <div className="flex-1 flex flex-col items-center justify-center gap-1 px-6">
                            <motion.a
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="text-4xl font-bold text-white py-4 active:text-wave-blue transition-colors"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                            >
                                Home
                            </motion.a>
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-4xl font-bold text-gray-400 py-4 active:text-white transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * (i + 1) }}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.a
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="mt-8 px-8 py-3.5 text-base font-medium rounded-full bg-wave-blue text-white active:bg-wave-blue/80 transition-colors"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Get in Touch
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SiteNavbar;
