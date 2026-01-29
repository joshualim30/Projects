import { LLMRequest, LLMResponse } from './llm';

export const OLLAMA_DEFAULT_URL = 'http://localhost:11434';
export const OLLAMA_DEFAULT_MODEL = 'llama3';

export const generateOllama = async (request: LLMRequest, baseUrl: string = OLLAMA_DEFAULT_URL): Promise<LLMResponse> => {
    const url = `${baseUrl.replace(/\/$/, '')}/api/generate`;
    const model = request.model || OLLAMA_DEFAULT_MODEL;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                prompt: request.prompt,
                stream: false,
                format: request.json ? 'json' : undefined,
                options: {
                    temperature: request.temperature
                }
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return { text: data.response };
    } catch (error) {
        console.error("Ollama Generation Error:", error);
        throw error;
    }
};

export const checkOllamaConnection = async (baseUrl: string = OLLAMA_DEFAULT_URL): Promise<boolean> => {
    const url = `${baseUrl.replace(/\/$/, '')}/api/tags`;
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (error) {
        console.warn("Ollama Connection Check Failed:", error);
        return false;
    }
};
