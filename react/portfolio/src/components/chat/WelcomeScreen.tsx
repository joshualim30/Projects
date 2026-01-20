import { motion } from 'framer-motion';

interface WelcomeScreenProps {
    onPromptSelect: (text: string) => void;
}

const SAMPLE_PROMPTS = [
    { text: "Tell me about your background!", icon: "👋" },
    { text: "Show me your recent projects!", icon: "💻" },
    { text: "What are your technical skills?", icon: "⚡" },
    { text: "How can I contact you?", icon: "📧" },
];

export const WelcomeScreen = ({ onPromptSelect }: WelcomeScreenProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[50vh] space-y-12 pt-24 md:pt-0">
            <div className="space-y-4 text-center">
                <motion.h1
                    className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] text-transparent bg-clip-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Hi! I'm Joshua Lim!
                </motion.h1>
                <motion.p
                    className="text-xl font-medium md:text-2xl text-gray-600 dark:text-[#C4C7C5]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    What would you like to know?
                </motion.p>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
            >
                {SAMPLE_PROMPTS.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => onPromptSelect(prompt.text)}
                        className="p-4 rounded-xl bg-white dark:bg-[#1E1F20] hover:bg-gray-50 dark:hover:bg-[#2D2E2F] border border-gray-200 dark:border-transparent hover:border-blue-200 dark:hover:border-[#444746] transition-all text-left group shadow-sm dark:shadow-none"
                    >
                        <span className="block text-gray-900 dark:text-[#E3E3E3] font-medium mb-1 font-mono text-sm">{prompt.icon} {prompt.text}</span>
                    </button>
                ))}
            </motion.div>
        </div>
    );
};
