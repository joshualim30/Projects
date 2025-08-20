import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@nextui-org/react';
import { ChevronUpIcon } from '@radix-ui/react-icons';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50"
                >
                    <Button
                        isIconOnly
                        color="primary"
                        variant="shadow"
                        radius="full"
                        size="lg"
                        className="font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 p-4"
                        onClick={scrollToTop}
                        aria-label="Scroll to top"
                    >
                        <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <ChevronUpIcon className="w-5 h-5" />
                        </motion.div>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop; 