import { GoogleGenerativeAI } from '@google/generative-ai';


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
// ... (initializeGemini and checkGeminiReady functions remain unchanged)

export const initializeGemini = (apiKey?: string) => {
    const key = apiKey || API_KEY;
    if (key) {
        genAI = new GoogleGenerativeAI(key);
        return true;
    }
    return false;
};

// Initialize if env var is present
initializeGemini();

export const checkGeminiReady = () => !!genAI;

export interface GeminiAnalysisResult {
    score: number;
    feedback: string;
    reasoning: string;
    suggestions: {
        title: string;
        explanation: string;
        importance: 'high' | 'medium' | 'low';
    }[];
    keywords: {
        found: string[];
        missing: string[];
    };
    impact: {
        score: number;
        feedback: string;
        metricsFound: string[];
    };
    formatting: {
        score: number;
        missingSections: string[];
    };
    actionVerbs: {
        score: number;
        count: number;
    };
}


export const generateGemini = async (prompt: string, json: boolean = false): Promise<string> => {
    if (!genAI) throw new Error("Gemini not initialized. Please provide an API Key.");

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: json ? "application/json" : "text/plain"
        }
    });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw error;
    }
};

