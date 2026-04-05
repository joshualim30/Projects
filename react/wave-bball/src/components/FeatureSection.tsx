import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface FeatureSectionProps {
    label?: string;
    title: string;
    description: string;
    imageSrc: string;
    imageAlt?: string;
    isReversed?: boolean;
    ctaText?: string;
    ctaLink?: string;
}

const FeatureSection = ({
    label,
    title,
    description,
    imageSrc,
    imageAlt = "Feature Image",
    isReversed = false,
    ctaText,
    ctaLink
}: FeatureSectionProps) => {
    return (
        <div className="py-16 sm:py-24 md:py-32 px-5 sm:px-6 md:px-8">
            <div className="section-container">
                <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 sm:gap-14 lg:gap-20`}>

                    {/* Image with glow on hover */}
                    <motion.div
                        className="w-full lg:w-1/2"
                        initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true, margin: "-80px" }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-br from-wave-blue/20 to-wave-orange/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
                                <img
                                    src={imageSrc}
                                    alt={imageAlt}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
                        {label && (
                            <motion.span
                                className="label-tag text-[10px] sm:text-xs"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                {label}
                            </motion.span>
                        )}

                        <motion.h2
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            {title}
                        </motion.h2>

                        <motion.p
                            className="text-[15px] sm:text-base md:text-lg text-gray-400 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            viewport={{ once: true }}
                        >
                            {description}
                        </motion.p>

                        {ctaText && ctaLink && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <a
                                    href={ctaLink}
                                    className="group inline-flex items-center gap-2 text-sm font-medium text-wave-blue hover:text-white transition-colors duration-200"
                                >
                                    {ctaText}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </a>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureSection;
