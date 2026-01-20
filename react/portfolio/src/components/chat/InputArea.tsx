import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface InputAreaProps {
    onSend: (text: string) => void;
    isLoading: boolean;
}

export const InputArea = ({ onSend, isLoading }: InputAreaProps) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'; // Reset height
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    return (
        <form onSubmit={handleSubmit} className="w-full relative group">
            <div className="relative flex items-center w-full p-2 bg-white dark:bg-[#1E1F20] border border-gray-200 dark:border-[#444746] rounded-3xl shadow-sm dark:shadow-none transition-colors focus-within:bg-gray-50 dark:focus-within:bg-[#1E1F20]">
                {/* <div className="pl-3 sm:pl-4 text-gray-400 dark:text-[#C4C7C5]">
                    <Sparkles size={20} className={isLoading ? "animate-pulse text-blue-500 dark:text-blue-400" : ""} />
                </div> */}

                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything :)"
                    className="flex-1 max-h-[200px] w-full bg-transparent border-none focus:ring-0 focus:outline-none outline-none resize-none text-gray-900 dark:text-[#E3E3E3] placeholder:text-gray-500 dark:placeholder:text-[#8E918F] py-4 px-3 sm:px-4 leading-6 sm:text-base text-sm overflow-y-auto no-scrollbar"
                    rows={1}
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2 mr-1 text-gray-900 dark:text-[#E3E3E3] disabled:text-gray-300 dark:disabled:text-[#444746] disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-[#2D2E2F] rounded-full transition-colors"
                >
                    <Send size={20} />
                </button>
            </div>

        </form>
    );
};

