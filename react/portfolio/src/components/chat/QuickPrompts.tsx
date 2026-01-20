import { motion } from 'framer-motion';

interface QuickPromptsProps {
    onPromptSelect: (text: string) => void;
    isLoading?: boolean;
}

const PROMPTS = [
    { text: "My background", icon: "👋", input: "Tell me a little bit about your background" },
    { text: "View projects", icon: "💻", input: "I would like to view your projects" },
    { text: "Get in touch", icon: "✉️", input: "I would like to get in touch with you" },
    { text: "Technical skills", icon: "⚡", input: "Tell me about your technical skills" },
    { text: "Experience", icon: "💼", input: "Tell me about your experience" },
    { text: "Education", icon: "🎓", input: "Tell me about your education" }
];

export const QuickPrompts = ({ onPromptSelect, isLoading }: QuickPromptsProps) => {
    return (
        <div className="w-full max-w-3xl mx-auto mb-2 overflow-hidden">
            <div
                className="flex gap-2 overflow-x-auto no-scrollbar mask-gradient py-1 px-4 md:px-0 -mx-4 md:mx-0 w-[calc(100%+32px)] md:w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {PROMPTS.map((prompt, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onPromptSelect(prompt.input)}
                        disabled={isLoading}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-colors whitespace-nowrap text-sm first:ml-0 last:mr-4 md:last:mr-0 ${isLoading
                            ? 'bg-gray-50 dark:bg-[#1E1F20] text-gray-400 dark:text-gray-600 border-gray-100 dark:border-[#2D2E2F] cursor-not-allowed'
                            : 'bg-gray-100 dark:bg-[#1E1F20] border-gray-200 dark:border-[#444746] hover:bg-gray-200 dark:hover:bg-[#2D2E2F] text-gray-700 dark:text-[#E3E3E3]'
                            }`}
                    >
                        <span>{prompt.icon}</span>
                        <span>{prompt.text}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
