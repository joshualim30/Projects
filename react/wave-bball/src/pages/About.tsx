import { useEffect } from 'react';
import Hero from '../components/Hero';
import CoachBio from '../components/CoachBio';
import Timeline from '../components/Timeline';
import FeatureSection from '../components/FeatureSection';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

import ShootingImg from '../assets/joshuaShooting.jpg';
import PassingImg from '../assets/joshuaPassing.jpg';
import LayupImg from '../assets/joshuaLayup.jpg';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="text-white">
            <Hero
                headline="About Joshua"
                subhead="Founder & Head Coach, Wave Basketball"
                backgroundImage={ShootingImg}
            />

            <CoachBio imageSrc={PassingImg} />

            <Timeline />

            {/* Game Film */}
            <div className="py-16 sm:py-24 md:py-32 px-5 sm:px-6 md:px-8">
                <div className="section-container">
                    <motion.div
                        className="text-center mb-12 sm:mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <span className="label-tag text-[10px] sm:text-xs">Film</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mt-3 sm:mt-4 mb-3 sm:mb-4">See It in Action</h2>
                        <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                            Game footage from Wave Basketball's inaugural season in Palm Bay, FL.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        {[
                            { id: "A8R3N0oiE5g", title: "Game 1" },
                            { id: "lcCL-YpTXCI", title: "Game 2" },
                        ].map((video, index) => (
                            <motion.div
                                key={video.id}
                                className="glass-card overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <div className="aspect-video">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video.id}`}
                                        title={video.title}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <div className="px-5 sm:px-6 py-4">
                                    <p className="text-sm font-medium text-gray-300">{video.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="text-center mt-8 sm:mt-10"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <a
                            href="https://www.youtube.com/@Wave_Basketball"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-sm font-medium text-wave-blue hover:text-white transition-colors duration-200"
                        >
                            More on YouTube
                            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </motion.div>
                </div>
            </div>

            <FeatureSection
                label="Values"
                title="The Wave Philosophy"
                description="At Wave Basketball, we believe in developing not just better players, but better people. Our philosophy centers on discipline, hard work, and relentless improvement. Every athlete gets a tailored approach because no two players develop the same way. We create a supportive yet challenging environment where you're pushed to reach your full potential, on and off the court."
                imageSrc={LayupImg}
                imageAlt="Player driving to basket"
                isReversed={true}
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
                    <span className="label-tag text-[10px] sm:text-xs">Train</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mt-3 sm:mt-4 mb-4 sm:mb-6">
                        Want to Work Together?
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10">
                        Whether you're just starting out or preparing for the next level, reach out and let's talk about your goals.
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

export default About;
