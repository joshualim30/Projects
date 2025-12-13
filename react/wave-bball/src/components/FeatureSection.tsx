
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';

interface FeatureSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  isReversed?: boolean; // If true, image is on the right
  ctaText?: string;
  ctaLink?: string;
}

const FeatureSection = ({
  title,
  description,
  imageSrc,
  imageAlt = "Feature Image",
  isReversed = false,
  ctaText,
  ctaLink
}: FeatureSectionProps) => {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className={`flex flex-col md:flex-row items-center gap-12 ${isReversed ? 'md:flex-row-reverse' : ''}`}>

        {/* Image Side */}
        <div className="w-full md:w-1/2">
          <motion.div
            className="rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img src={imageSrc} alt={imageAlt} className="w-full h-auto object-cover" />
          </motion.div>
        </div>

        {/* content Side */}
        <div className="w-full md:w-1/2 space-y-6">
          <motion.h2
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
            initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {description}
          </motion.p>

          {ctaText && ctaLink && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button
                as="a"
                href={ctaLink}
                color="secondary"
                size="lg"
                className="font-semibold"
              >
                {ctaText}
              </Button>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FeatureSection;
