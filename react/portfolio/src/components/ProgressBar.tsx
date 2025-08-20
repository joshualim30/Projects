import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

const ProgressBar: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            setProgress(scrollProgress);
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Call once to set initial progress
        
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-primary dark:to-secondary z-50 shadow-lg"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            style={{ transformOrigin: 'left' }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
        />
    );
};

export default ProgressBar; 