import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
    headline: string;
    subhead?: string;
    ctaText?: string;
    ctaLink?: string;
    onCtaClick?: () => void;
    backgroundImage?: string;
    fullHeight?: boolean;
}

const Hero = ({ headline, subhead, ctaText, ctaLink, onCtaClick, backgroundImage, fullHeight = false }: HeroProps) => {
    return (
        <div className={`relative w-full ${fullHeight ? 'min-h-screen' : 'min-h-[75vh] md:min-h-[85vh]'} flex items-end overflow-hidden`}>
            {/* Background image with zoom-in effect */}
            {backgroundImage && (
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                >
                    <img
                        src={backgroundImage}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            )}

            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#080E1A] via-[#080E1A]/60 to-[#080E1A]/20" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#080E1A]/40 to-transparent" />

            {/* Content — bottom-aligned for editorial feel */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pb-14 sm:pb-20 md:pb-28">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 sm:mb-6"
                >
                    <span className="label-tag text-[10px] sm:text-xs">Wave Basketball</span>
                </motion.div>

                <motion.h1
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[0.95] mb-4 sm:mb-6 max-w-4xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    {headline}
                </motion.h1>

                {subhead && (
                    <motion.p
                        className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 max-w-xl font-light leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        {subhead}
                    </motion.p>
                )}

                {ctaText && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        {ctaLink ? (
                            <a
                                href={ctaLink}
                                className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 text-sm font-medium rounded-full bg-white text-[#080E1A] hover:bg-gray-100 transition-all duration-200 active:scale-[0.98]"
                            >
                                {ctaText}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        ) : (
                            <button
                                onClick={onCtaClick}
                                className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 text-sm font-medium rounded-full bg-white text-[#080E1A] hover:bg-gray-100 transition-all duration-200 active:scale-[0.98]"
                            >
                                {ctaText}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Hero;
