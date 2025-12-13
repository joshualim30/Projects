
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';

interface HeroProps {
  headline: string;
  subhead?: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
}

const Hero = ({ headline, subhead, ctaText, ctaLink, onCtaClick, backgroundImage }: HeroProps) => {
  return (
    <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <img src={backgroundImage} alt="Hero Background" className="w-full h-full object-cover opacity-50" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
        )}
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {headline}
        </motion.h1>

        {subhead && (
          <motion.p
            className="text-xl md:text-2xl text-gray-200 mb-8 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {subhead}
          </motion.p>
        )}

        {ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {ctaLink ? (
              <Button
                as="a"
                href={ctaLink}
                size="lg"
                color="primary"
                className="font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                {ctaText}
              </Button>
            ) : (
              <Button
                onClick={onCtaClick}
                size="lg"
                color="primary"
                className="font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                {ctaText}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Hero;
