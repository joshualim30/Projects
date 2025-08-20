import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

const ProgressBar: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const scrollContainer = document.querySelector('.scroll-container');
        
        const updateProgress = () => {
            if (scrollContainer) {
                const scrollTop = scrollContainer.scrollTop;
                const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
                const scrollProgress = (scrollTop / scrollHeight) * 100;
                setProgress(scrollProgress);
            }
        };

        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', updateProgress);
            return () => scrollContainer.removeEventListener('scroll', updateProgress);
        }
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.1 }}
        />
    );
};

export default ProgressBar; 