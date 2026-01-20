import { Message } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ProjectsView } from './actions/ProjectsView';
import { ContactView } from './actions/ContactView';
import Picture from '../../../public/headshot.jpg';

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
}

const TypingEffect = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        // Immediate start
        if (text.length === 0) {
            onComplete?.();
            return;
        }

        const intervalId = setInterval(() => {
            setDisplayedText(() => text.slice(0, index + 1));
            index++;
            if (index >= text.length) {
                clearInterval(intervalId);
                onComplete?.();
            }
        }, 15);

        return () => clearInterval(intervalId);
    }, [text]); // Intentionally not including onComplete in dependency to avoid re-runs if it changes, though it shouldn't

    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ node, ...props }) => <a {...props} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />,
                    p: ({ node, ...props }) => <p {...props} className="mb-4 last:mb-0 text-gray-900 dark:text-[#E3E3E3]" />,
                    ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-4 mb-4 text-gray-900 dark:text-[#E3E3E3]" />,
                    ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-4 mb-4 text-gray-900 dark:text-[#E3E3E3]" />,
                    code: ({ node, ...props }) => {
                        const { className, children } = props;
                        return (
                            <code className={`${className} bg-gray-100 dark:bg-[#1E1F20] text-gray-900 dark:text-[#E3E3E3] px-1.5 py-0.5 rounded text-sm font-mono`}>
                                {children}
                            </code>
                        )
                    }
                }}
            >
                {displayedText}
            </ReactMarkdown>
        </div>
    );
};

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
    const [lastMessageFullyTyped, setLastMessageFullyTyped] = useState(false);

    // If new messages come in, reset typed state if the last one is new
    useEffect(() => {
        setLastMessageFullyTyped(false);
    }, [messages.length]);

    return (
        <div className="flex flex-col space-y-6 max-w-3xl mx-auto w-full">
            {messages.map((msg, index) => {
                const isLastMessage = index === messages.length - 1;
                const isModel = msg.role === 'model';

                return (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex w-full gap-4 ${!isModel ? 'justify-end' : 'justify-start'}`}
                    >
                        {isModel && (
                            <div className="flex-shrink-0 mt-1">
                                <img
                                    src={Picture}
                                    alt="Joshua Lim"
                                    className="w-8 h-8 rounded-full shadow-sm"
                                />
                            </div>
                        )}

                        <div
                            className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${!isModel ? 'items-end' : 'items-start'
                                }`}
                        >
                            <div className={`text-[15px] sm:text-[16px] leading-7 ${!isModel ? 'bg-gray-100 dark:bg-[#28292A] text-gray-900 dark:text-[#E3E3E3] px-5 py-2.5 rounded-[20px] rounded-tr-sm' : 'text-gray-900 dark:text-[#E3E3E3]'}`}>
                                {!isModel ? (
                                    msg.content
                                ) : (
                                    isLastMessage ? (
                                        <TypingEffect
                                            text={msg.content}
                                            onComplete={() => setLastMessageFullyTyped(true)}
                                        />
                                    ) : (
                                        <div className="markdown-content">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    a: ({ node, ...props }) => <a {...props} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />,
                                                    p: ({ node, ...props }) => <p {...props} className="mb-4 last:mb-0 text-gray-900 dark:text-[#E3E3E3]" />,
                                                    ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-4 mb-4 text-gray-900 dark:text-[#E3E3E3]" />,
                                                    ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-4 mb-4 text-gray-900 dark:text-[#E3E3E3]" />,
                                                    code: ({ node, ...props }) => {
                                                        const { className, children } = props;
                                                        return (
                                                            <code className={`${className} bg-gray-100 dark:bg-[#1E1F20] text-gray-900 dark:text-[#E3E3E3] px-1.5 py-0.5 rounded text-sm font-mono`}>
                                                                {children}
                                                            </code>
                                                        )
                                                    }
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* ACTION RENDERING */}
                            {isModel && msg.action === 'show_projects' && (isLastMessage ? lastMessageFullyTyped : true) && (
                                <ProjectsView />
                            )}
                            {isModel && msg.action === 'show_contact' && (isLastMessage ? lastMessageFullyTyped : true) && (
                                <ContactView />
                            )}
                        </div>
                    </motion.div>
                );
            })}

            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4"
                >
                    <div className="flex-shrink-0 mt-1">
                        <img
                            src="https://github.com/joshualim30.png"
                            alt="Joshua Lim"
                            className="w-8 h-8 rounded-full shadow-sm"
                        />
                    </div>
                    <div className="flex items-center space-x-1 h-8">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// SparkleIcon removed

