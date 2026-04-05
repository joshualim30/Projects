import { motion } from 'framer-motion';

interface TimelineEntry {
    year: string;
    title: string;
    description: string;
}

const milestones: TimelineEntry[] = [
    {
        year: "2004",
        title: "First Picked Up a Basketball",
        description: "Started playing at just two years old. From that point on, basketball became a constant in every stage of life.",
    },
    {
        year: "2010s",
        title: "National AAU & Elite Showcases",
        description: "Competed on the Adidas Gauntlet and NYBL circuits against top national talent. Earned invitations to Future 150, MSHTV, Indiana Crossroads, and other elite showcases.",
    },
    {
        year: "2010s",
        title: "Trained at the Highest Level",
        description: "Worked with Pete Gaudet, a veteran college assistant coach with decades of experience. Trained under NBA shooting coach Peter Patton and alongside McDonald's All-American Drew Lavender.",
    },
    {
        year: "2018-22",
        title: "High School Varsity Starter",
        description: "Earned a starting varsity spot and competed at a high level throughout all four years of high school basketball.",
    },
    {
        year: "2024",
        title: "Founded Wave Basketball",
        description: "Started Wave Basketball in Palm Bay, FL and coached a team from October through December 2024. Now based in San Francisco, continuing to develop the next generation of athletes.",
    },
];

const Timeline = () => {
    return (
        <div className="py-16 sm:py-24 md:py-32 px-5 sm:px-6 md:px-8 bg-white/[0.01]">
            <div className="section-container">
                <motion.div
                    className="text-center mb-14 sm:mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="label-tag text-[10px] sm:text-xs">Journey</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mt-3 sm:mt-4">The Path Here</h2>
                </motion.div>

                <div className="relative max-w-3xl mx-auto">
                    {/* Vertical line */}
                    <div className="absolute left-3 sm:left-4 md:left-8 top-2 bottom-0 w-px bg-gradient-to-b from-wave-blue/30 via-wave-blue/10 to-transparent" />

                    <div className="space-y-10 sm:space-y-14 md:space-y-16">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={index}
                                className="relative pl-10 sm:pl-12 md:pl-24"
                                initial={{ opacity: 0, x: -15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                {/* Dot on the line */}
                                <div className="absolute left-3 sm:left-4 md:left-8 top-1.5 -translate-x-1/2">
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-wave-blue ring-[3px] sm:ring-4 ring-[#080E1A]" />
                                </div>

                                <span className="text-wave-orange text-xs sm:text-sm font-semibold tracking-wider">
                                    {milestone.year}
                                </span>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-1.5 sm:mt-2 mb-2 sm:mb-3">
                                    {milestone.title}
                                </h3>
                                <p className="text-gray-400 text-sm sm:text-[15px] leading-relaxed max-w-lg">
                                    {milestone.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
