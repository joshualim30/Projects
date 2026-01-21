import { motion } from 'framer-motion';

interface QuickPromptsProps {
    onPromptSelect: (text: string) => void;
    isLoading?: boolean;
}

const PROMPTS = [
    { text: "Hiring", icon: "❓", input: "I am an employer or recruiter, ask me about my company and what I am looking for, and tell me how you would benefit my team!" },
    { text: "Projects", icon: "💻", input: "I would like to view your projects!" },
    { text: "Contact", icon: "✉️", input: "I would like to get in touch with you! How can I contact you?" },
    { text: "Technical Skills", icon: "⚡", input: "Tell me about your technical skills!" },
    { text: "Experience", icon: "💼", input: "Tell me about your experience in the tech industry!" },
    { text: "Education", icon: "🎓", input: "Tell me about your education, where you studied, and what you learned!" },
    { text: "Background", icon: "👋", input: "Tell me a little bit about your background! I would like to get to know you more!" },
    { text: "Hobbies", icon: "🎨", input: "Tell me about your hobbies! I would like to know more about your interests!" },
];

export const QuickPrompts = ({ onPromptSelect, isLoading }: QuickPromptsProps) => {
    return (
        <div className="w-full max-w-3xl mx-auto mb-2 overflow-hidden">
            <div
                className="flex gap-2 overflow-x-auto no-scrollbar mask-gradient py-1 px-8 md:px-4 -mx-8 md:-mx-4 w-[calc(100%+16px)] md:w-full"
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
                            ? 'bg-gray-50 dark:bg-[#1E1F20] text-gray-500 dark:text-gray-600 border-gray-100 dark:border-[#2D2E2F] cursor-not-allowed'
                            : 'bg-gray-100 dark:bg-[#1E1F20] border-gray-200 dark:border-[#444746] hover:bg-gray-200 dark:hover:bg-[#2D2E2F] text-gray-700 dark:text-white'
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
