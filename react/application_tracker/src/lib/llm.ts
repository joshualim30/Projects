export interface LLMRequest {
    prompt: string;
    model?: string;
    temperature?: number;
    json?: boolean;
}

export interface LLMResponse {
    text: string;
}

export type LLMProvider = 'gemini' | 'ollama';

export interface AIProviderConfig {
    provider: LLMProvider;
    geminiKey?: string;
    ollamaUrl?: string;
    ollamaModel?: string;
}
