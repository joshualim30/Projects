import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaGithub, FaLinkedin } from 'react-icons/fa';
import Self from "../assets/images/joshua.jpg";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || isOpen
                ? 'glass shadow-lg py-4'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <a href="#" className="text-2xl font-TitilliumWebBold text-gradient">
                    <img src={Self} alt="Logo" className="w-12 h-12 rounded-full" />
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-light-foreground dark:text-dark-foreground hover:text-light-primary dark:hover:text-dark-primary transition-colors font-TitilliumWebSemiBold"
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-4" />

                    <div className="flex items-center space-x-4">
                        <a href="https://github.com/joshualim30" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-light-primary dark:hover:text-dark-primary transition-colors">
                            <FaGithub />
                        </a>
                        <a href="https://linkedin.com/in/joshualim30" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-light-primary dark:hover:text-dark-primary transition-colors">
                            <FaLinkedin />
                        </a>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-4">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-2xl focus:outline-none text-light-foreground dark:text-dark-foreground"
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col items-center py-8 space-y-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-TitilliumWebSemiBold hover:text-light-primary dark:hover:text-dark-primary transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="flex space-x-6 pt-4">
                                <a href="https://github.com/joshualim30" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-light-primary dark:hover:text-dark-primary transition-colors">
                                    <FaGithub />
                                </a>
                                <a href="https://linkedin.com/in/joshualim30" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-light-primary dark:hover:text-dark-primary transition-colors">
                                    <FaLinkedin />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;