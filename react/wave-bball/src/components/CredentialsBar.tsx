import { motion } from 'framer-motion';

const credentials = [
    { value: "10+", label: "Years on the Court" },
    { value: "Elite", label: "Training Background" },
    { value: "Professional", label: "Playing Experience" },
    { value: "SF", label: "Bay Area Based" },
];

const CredentialsBar = () => {
    return (
        <div className="py-14 sm:py-16 md:py-20 px-5 sm:px-6 md:px-8 border-y border-white/[0.04]">
            <div className="section-container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-4">
                    {credentials.map((item, index) => (
                        <motion.div
                            key={item.label}
                            className="text-center py-2"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1.5 tracking-tight">
                                {item.value}
                            </div>
                            <div className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">
                                {item.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CredentialsBar;
