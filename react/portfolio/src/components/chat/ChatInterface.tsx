import { useState, useRef, useEffect } from 'react';
import { Message, ChatState } from '../../types';
import { InputArea } from './InputArea';
import { MessageList } from './MessageList';
import { WelcomeScreen } from './WelcomeScreen';
import { QuickPrompts } from './QuickPrompts';
import { generateResponse } from '../../services/gemini';

export const ChatInterface = () => {
    const [chatState, setChatState] = useState<ChatState>({
        messages: [],
        isLoading: false,
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (chatState.messages.length > 0) {
            scrollToBottom();
        }
    }, [chatState.messages, chatState.isLoading]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: text,
            timestamp: new Date(),
        };

        setChatState((prev) => ({
            ...prev,
            messages: [...prev.messages, userMsg],
            isLoading: true,
        }));

        try {
            // 1. Prepare history for API
            // Simple history mapping: passed to function
            const history = chatState.messages.map(m => ({
                role: m.role,
                content: m.content
            }));

            // 2. Call cloud function
            let responseText = await generateResponse(text, history);

            // 3. Parse Actions/Tags
            let action: 'show_projects' | 'show_contact' | undefined;

            if (responseText.includes('[[SHOW_PROJECTS]]')) {
                action = 'show_projects';
                responseText = responseText.replace('[[SHOW_PROJECTS]]', '').trim();
            } else if (responseText.includes('[[SHOW_CONTACT]]')) {
                action = 'show_contact';
                responseText = responseText.replace('[[SHOW_CONTACT]]', '').trim();
            }

            const botMsg: Message = {
                id: crypto.randomUUID(),
                role: 'model',
                content: responseText,
                timestamp: new Date(),
                action: action
            };

            setChatState((prev) => ({
                messages: [...prev.messages, botMsg],
                isLoading: false,
            }));
        } catch (error) {
            console.error('Error generating response:', error);
            setChatState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-[#131314] relative text-sm sm:text-base">
            {/* Messages Area - Full height with padding bottom for footer */}
            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth overscroll-y-contain px-4 pt-16 md:pt-8 pb-48 sm:pb-40 md:pb-64">
                <div className="max-w-3xl mx-auto w-full">
                    {chatState.messages.length === 0 ? (
                        <WelcomeScreen onPromptSelect={handleSendMessage} />
                    ) : (
                        <MessageList messages={chatState.messages} isLoading={chatState.isLoading} />
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area Container - Absolute bottom with backdrop blur and fade mask */}
            <div className="absolute bottom-0 left-0 right-0 z-10 transition-all duration-200 ease-out">
                {/* Gradient Fade Top */}
                <div className="h-8 sm:h-12 w-full bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#131314] dark:via-[#131314]/80 dark:to-transparent pointer-events-none" />

                {/* Main Input Background */}
                <div className="bg-white/90 dark:bg-[#131314]/90 backdrop-blur-md px-4 pt-2 pb-[calc(2rem+env(safe-area-inset-bottom))]">
                    <div className="max-w-3xl mx-auto flex flex-col items-center w-full">
                        {chatState.messages.length > 0 && (
                            <QuickPrompts onPromptSelect={handleSendMessage} isLoading={chatState.isLoading} />
                        )}
                        <InputArea onSend={handleSendMessage} isLoading={chatState.isLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
};
