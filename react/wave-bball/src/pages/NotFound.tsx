import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Circle } from 'lucide-react';

const NotFound = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center px-5 sm:px-6 md:px-8">
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
                    <span className="text-8xl sm:text-9xl md:text-[10rem] font-bold text-white leading-none">4</span>
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Circle className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-wave-orange fill-wave-orange/20" strokeWidth={1.5} />
                    </motion.div>
                    <span className="text-8xl sm:text-9xl md:text-[10rem] font-bold text-white leading-none">4</span>
                </div>

                <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-md mx-auto">
                    Looks like this page went out of bounds.
                </p>

                <a
                    href="/"
                    className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium rounded-full bg-wave-blue text-white hover:bg-wave-blue/90 transition-all duration-200 active:scale-[0.98]"
                >
                    Back to Home
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
            </motion.div>
        </div>
    );
};

export default NotFound;
