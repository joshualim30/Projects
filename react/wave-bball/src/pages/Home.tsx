import { useEffect } from 'react';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';

// Assets
import ShootingImg from '../assets/joshuaShooting.jpg';
import PassingImg from '../assets/joshuaPassing.jpg';
import LayupImg from '../assets/joshuaLayup.jpg';

const Home = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="text-white min-h-screen">
            {/* Hero Section */}
            <Hero
                headline="ELEVATE YOUR GAME"
                subhead="Elite Basketball Training & Coaching for the Next Generation of Athletes."
                ctaText="Start Training"
                ctaLink="/training"
                backgroundImage={ShootingImg}
            />

            {/* Philosophy Section */}
            <FeatureSection
                title="MORE THAN A GAME"
                description="At Wave Basketball, we believe in developing not just better players, but better people. Our philosophy centers on discipline, teamwork, and relentless improvement. We provide a supportive yet challenging environment where athletes can reach their full potential."
                imageSrc={PassingImg}
                imageAlt="Coach explaining play"
                isReversed={true}
            />

            {/* Training Focus Section */}
            <FeatureSection
                title="PROFESSIONAL COACHING"
                description="Whether you're looking to refine your shooting mechanics, improve basketball IQ, or get in game shape, our expert coaches are here to guide you. We offer 1-on-1 sessions, small group training, and team clinics tailored to your specific goals."
                imageSrc={LayupImg}
                imageAlt="Player driving to basket"
                ctaText="View Programs"
                ctaLink="/training"
            />

            {/* Join Training Call to Action */}
            <div className="py-24 px-6 bg-gradient-to-b from-zinc-900 to-black text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        READY TO LEVEL UP?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Join the Wave family today. Create your profile, book sessions, and track your progress.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            as="a"
                            href="/customer"
                            size="lg"
                            color="primary"
                            className="font-bold text-lg px-10 py-6 rounded-full shadow-lg shadow-primary/20"
                        >
                            Create Player Profile
                        </Button>
                        <Button
                            as="a"
                            href="/training"
                            size="lg"
                            variant="bordered"
                            className="font-bold text-lg px-10 py-6 rounded-full border-white/20 text-white hover:bg-white/10"
                        >
                            View Programs
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
