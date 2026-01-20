import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';

export const ContactView = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-white dark:bg-[#1E1F20] border border-gray-200 dark:border-[#444746] rounded-xl p-6 max-w-sm shadow-md dark:shadow-none"
        >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E3E3E3] mb-4">Get in touch</h3>
            <div className="space-y-4">
                <a
                    href="mailto:joshua@example.com"
                    className="flex items-center space-x-3 text-gray-600 dark:text-[#C4C7C5] hover:text-blue-600 dark:hover:text-[#A8C7FA] transition-colors p-2 hover:bg-gray-100 dark:hover:bg-[#2D2E2F] rounded-lg -mx-2"
                >
                    <Mail size={20} />
                    <span>joshua@example.com</span>
                </a>
                <a
                    href="https://linkedin.com/in/joshualim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-600 dark:text-[#C4C7C5] hover:text-blue-600 dark:hover:text-[#A8C7FA] transition-colors p-2 hover:bg-gray-100 dark:hover:bg-[#2D2E2F] rounded-lg -mx-2"
                >
                    <Linkedin size={20} />
                    <span>LinkedIn Profile</span>
                </a>
                <a
                    href="https://github.com/joshualim30"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-600 dark:text-[#C4C7C5] hover:text-blue-600 dark:hover:text-[#A8C7FA] transition-colors p-2 hover:bg-gray-100 dark:hover:bg-[#2D2E2F] rounded-lg -mx-2"
                >
                    <Github size={20} />
                    <span>GitHub</span>
                </a>
            </div>
        </motion.div>
    );
};
