import { motion } from 'framer-motion';

interface CoachBioProps {
    imageSrc: string;
    imageAlt?: string;
}

const CoachBio = ({ imageSrc, imageAlt = "Coach Joshua Lim" }: CoachBioProps) => {
    return (
        <div className="py-16 sm:py-24 md:py-32 px-5 sm:px-6 md:px-8">
            <div className="section-container">
                <div className="flex flex-col lg:flex-row gap-10 sm:gap-14 lg:gap-20">
                    {/* Photo with subtle border glow */}
                    <motion.div
                        className="w-full lg:w-5/12 shrink-0"
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative">
                            <div className="absolute -inset-px rounded-xl sm:rounded-2xl bg-gradient-to-b from-wave-blue/20 to-transparent" />
                            <img
                                src={imageSrc}
                                alt={imageAlt}
                                className="relative w-full rounded-xl sm:rounded-2xl object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Bio */}
                    <motion.div
                        className="w-full lg:w-7/12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        viewport={{ once: true }}
                    >
                        <span className="label-tag text-[10px] sm:text-xs">The Coach</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 sm:mt-4 mb-1.5 tracking-tight">
                            Joshua Lim
                        </h2>
                        <p className="text-wave-orange font-medium text-sm sm:text-base mb-6 sm:mb-8">
                            Founder & Head Coach
                        </p>

                        <div className="space-y-4 sm:space-y-5 text-gray-400 leading-[1.75] sm:leading-[1.8] text-sm sm:text-[15px]">
                            <p>
                                I've been around basketball my entire life. I first picked up a ball at two years old, and the game has shaped everything since. Growing up, I competed on national AAU circuits including the Adidas Gauntlet and NYBL, and earned invitations to showcases like Future 150, MSHTV, and Indiana Crossroads.
                            </p>
                            <p>
                                Along the way, I had the chance to learn from people who operate at the highest levels of the sport. I trained under Pete Gaudet, a veteran college assistant coach with decades of experience in player development. I worked with Peter Patton, an NBA shooting coach, on mechanics and scoring. I also got to train alongside guys like Drew Lavender, a McDonald's All-American who went on to play at Xavier and professionally overseas.
                            </p>
                            <p>
                                In high school, I earned a varsity starting spot and continued competing at a high level through my senior year in 2022. That combination of national competition and learning from coaches and players at the top of the game gave me a perspective on development that goes well beyond skills and drills.
                            </p>
                            <p>
                                I started Wave Basketball in Palm Bay, FL in late 2024, where I coached a team through the fall season. The coaches and mentors I had changed the way I see the game, and I wanted to bring that same level of investment to the next generation. Now based in San Francisco, my goal as a college student and coach is to keep doing exactly that.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CoachBio;
