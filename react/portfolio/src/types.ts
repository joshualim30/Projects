export interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
    action?: 'show_projects' | 'show_contact'; // For custom UI rendering
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    image?: string;
}
