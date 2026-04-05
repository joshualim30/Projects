import { useEffect } from 'react';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import CredentialsBar from '../components/CredentialsBar';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import ShootingImg from '../assets/joshuaShooting.jpg';
import PassingImg from '../assets/joshuaPassing.jpg';
import LayupImg from '../assets/joshuaLayup.jpg';

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="text-white">
            <Hero
                headline="Elevate Your Game."
                subhead="Elite basketball training and player development in San Francisco. Built on real experience, designed for serious athletes."
                ctaText="Meet the Coach"
                ctaLink="/about"
                backgroundImage={ShootingImg}
                fullHeight
            />

            <CredentialsBar />

            <FeatureSection
                label="Philosophy"
                title="Built on the Court"
                description="Wave Basketball is rooted in real experience. Years of national AAU competition, training under college and NBA-level coaches, and high-level play all feed into how Coach Joshua approaches every session. This isn't textbook coaching. It's built on what actually works on the court."
                imageSrc={PassingImg}
                imageAlt="Coach Joshua passing"
                isReversed={false}
                ctaText="Learn more about Joshua"
                ctaLink="/about"
            />

            <FeatureSection
                label="Background"
                title="Trained by the Best"
                description="From competing on the Adidas Gauntlet to training under veteran college coaches and NBA shooting coaches, Joshua's development was shaped by some of the best in the game. That experience now drives every session he runs with the next generation of athletes."
                imageSrc={LayupImg}
                imageAlt="Player driving to basket"
                isReversed={true}
                ctaText="Read the full story"
                ctaLink="/about"
            />

            {/* CTA */}
            <div className="py-20 sm:py-24 md:py-32 px-5 sm:px-6 md:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <span className="label-tag text-[10px] sm:text-xs">Get Started</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mt-3 sm:mt-4 mb-4 sm:mb-6">
                        Ready to Level Up?
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10">
                        Reach out to learn more about training with Wave Basketball.
                    </p>
                    <a
                        href="/contact"
                        className="group inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 text-sm font-medium rounded-full bg-wave-orange text-white hover:bg-wave-orange/90 transition-all duration-200 hover:shadow-lg hover:shadow-wave-orange/20 active:scale-[0.98]"
                    >
                        Get in Touch
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
