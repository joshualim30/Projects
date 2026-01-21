import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface WelcomeScreenProps {
    onPromptSelect: (text: string) => void;
}

const SAMPLE_PROMPTS = [
    { text: "Tell me about your background!", icon: "👋" },
    { text: "Show me your recent projects!", icon: "💻" },
    { text: "What are your technical skills?", icon: "⚡" },
    { text: "How can I get in touch with you?", icon: "📧" },
];

const Typewriter = ({ lines, delay = 0, cursorColor = "bg-blue-500" }: { lines: string[], delay?: number, cursorColor?: string }) => {
    const [currentLine, setCurrentLine] = useState(0);
    const [currentChar, setCurrentChar] = useState(0);
    const [startTyping, setStartTyping] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setStartTyping(true), delay * 1000);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!startTyping) return;

        if (currentLine >= lines.length) return;

        if (currentChar < lines[currentLine].length) {
            const timeout = setTimeout(() => {
                setCurrentChar(prev => prev + 1);
            }, 50);
            return () => clearTimeout(timeout);
        } else if (currentLine < lines.length - 1) {
            const timeout = setTimeout(() => {
                setCurrentLine(prev => prev + 1);
                setCurrentChar(0);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [startTyping, currentChar, currentLine, lines]);

    return (
        <span>
            {lines.map((line, index) => (
                <span key={index} className="block">
                    {index < currentLine ? line : index === currentLine ? line.slice(0, currentChar) : ''}
                    {index === currentLine && (
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className={`inline-block w-[3px] h-[1em] ${cursorColor} ml-1 align-text-bottom`}
                        />
                    )}
                </span>
            ))}
        </span>
    );
};

export const WelcomeScreen = ({ onPromptSelect }: WelcomeScreenProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[50vh] space-y-12 pt-24 md:pt-0">
            <div className="space-y-4 text-center mt-12">
                <motion.h1
                    className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text min-h-[1.5em]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Typewriter lines={["Hey there,", "I'm Joshua!"]} delay={0.5} />
                </motion.h1>
                <motion.p
                    className="text-xl font-medium md:text-2xl text-gray-600 dark:text-[#C4C7C5] min-h-[3em]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.0, duration: 0.8 }}
                >
                    What would you like to
                    <br />
                    learn about me today?
                </motion.p>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8, duration: 0.6 }}
            >
                {SAMPLE_PROMPTS.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => onPromptSelect(prompt.text)}
                        className="p-4 rounded-xl bg-white dark:bg-[#1E1F20] hover:bg-gray-50 dark:hover:bg-[#2D2E2F] border border-gray-200 dark:border-transparent hover:border-blue-200 dark:hover:border-[#444746] transition-all text-left group shadow-sm dark:shadow-none"
                    >
                        {/* Icon */}
                        <span className="block text-gray-900 dark:text-[#E3E3E3] font-medium mb-1 font-mono text-sm">{prompt.icon}</span>
                        {/* Text */}
                        <span className="block text-gray-900 dark:text-[#E3E3E3] font-medium mb-1 font-mono text-sm">{prompt.text}</span>
                    </button>
                ))}
            </motion.div>
        </div>
    );
};
