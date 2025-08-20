import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@nextui-org/react';
import { IoArrowUp } from 'react-icons/io5';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const scrollContainer = document.querySelector('.scroll-container');
        
        const toggleVisibility = () => {
            if (scrollContainer && scrollContainer.scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', toggleVisibility);
            return () => scrollContainer.removeEventListener('scroll', toggleVisibility);
        }
    }, []);

    const scrollToTop = () => {
        const scrollContainer = document.querySelector('.scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <Button
                        isIconOnly
                        color="primary"
                        variant="shadow"
                        radius="full"
                        className="font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                        onClick={scrollToTop}
                        aria-label="Scroll to top"
                    >
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <IoArrowUp className="w-5 h-5 text-white" />
                        </motion.div>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop; 