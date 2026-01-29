import { generateGemini } from './gemini';
import { generateOllama, OLLAMA_DEFAULT_URL, OLLAMA_DEFAULT_MODEL } from './ollama';
import { UserProfile } from '../components/Profile';
import { AppStorage } from './storage';

export interface AIAnalysisResult {
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

const getAIConfig = async () => {
    const provider = await AppStorage.getItem('AI_PROVIDER') || 'gemini';
    const ollamaUrl = await AppStorage.getItem('OLLAMA_URL') || OLLAMA_DEFAULT_URL;
    const ollamaModel = await AppStorage.getItem('OLLAMA_MODEL') || OLLAMA_DEFAULT_MODEL;
    return { provider, ollamaUrl, ollamaModel };
};

export const generateCompletion = async (prompt: string, json: boolean = false): Promise<string> => {
    const config = await getAIConfig();

    if (config.provider === 'ollama') {
        const response = await generateOllama({
            prompt,
            model: config.ollamaModel,
            json
        }, config.ollamaUrl);
        return response.text;
    } else {
        return generateGemini(prompt, json);
    }
};

export const analyzeResumeAI = async (resumeText: string, jobDescription: string): Promise<AIAnalysisResult> => {
    const prompt = `
    You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter. 
    Analyze the following resume against the job description.

    Resume:
    ${resumeText}

    Job Description:
    ${jobDescription}

    Provide the output STRICTLY in the following JSON format (no markdown code blocks, just raw JSON). 
    Ensure the JSON is valid and parsable.
    
    Structure:
    {
        "score": number (0-100 overall match score),
        "feedback": "concise executive summary (max 2 sentences)",
        "reasoning": "A comprehensive paragraph explaining WHY the score is what it is. Mention specific strengths and critical weaknesses. Be direct and professional.",
        "suggestions": [
            {
                "title": "Short action title (e.g. 'Quantify Achievements')",
                "explanation": "Detailed instruction on how to fix this specific issue.",
                "importance": "high" | "medium" | "low"
            }
        ],
        "keywords": {
            "found": ["list", "of", "matching", "hard", "skills", "found", "in", "resume"],
            "missing": ["list", "of", "critical", "keywords", "from", "JD", "missing", "in", "resume"]
        },
        "impact": {
            "score": number (0-25 based on quantification of achievements),
            "feedback": "analysis of how well achievements are quantified",
            "metricsFound": ["list", "of", "specific", "metrics", "quoted", "from", "resume", "e.g. 'Increased revenue by 20%'"]
        },
        "formatting": {
            "score": number (0-20 based on structure and clarity),
            "missingSections": ["list", "of", "missing", "standard", "sections", "e.g. 'Experience', 'Education', 'Projects']
        },
        "actionVerbs": {
            "score": number (0-15 based on strength of verbs),
            "count": number (count of strong action verbs used)
        }
    }
    `;

    try {
        const text = await generateCompletion(prompt, true);
        const cleanJson = text.replace(/```json\s*/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw new Error("Failed to analyze resume with AI.");
    }
};

export const generateCoverLetterAI = async (resumeText: string, jobDescription: string, profileContext?: UserProfile): Promise<string> => {
    // Construct the context string from profile data
    let userContextString = "";
    if (profileContext) {
        if (profileContext.bio) userContextString += `USER BIO: "${profileContext.bio}"\n`;
        if (profileContext.key_achievements) userContextString += `USER KEY ACHIEVEMENTS: "${profileContext.key_achievements}"\n`;
        if (profileContext.experience_summary) userContextString += `USER EXPERIENCE SUMMARY: "${profileContext.experience_summary}"\n`;
    }

    const prompt = `
    You are an expert career coach and professional writer. Write a highly personalized, "techy," and enthusiastic cover letter for a Software Engineer position.

    1. **ANALYSIS**:
       - RESUME:
       ${resumeText.substring(0, 8000)}
       
       - JOB DESCRIPTION:
       ${jobDescription.substring(0, 5000)}

       - USER PERSONAL CONTEXT (CRITICAL - USE THIS TO PERSONALIZE):
       ${userContextString}

    2. **INSTRUCTIONS**:
       - Tone: Professional, confident, enthusiastic, and modern. NOT generic or stiff.
       - Structure:
         - **Hook**: Strong opening that mentions the company name and why the user is specifically excited about THEIR mission/product. Avoid "I am writing to apply...".
         - **The "Why Me"**: Connect the user's *Key Achievements* and *Experience* (from the provided context) directly to the *Job Requirements*. Use metrics if available.
         - **Cultural Fit**: Mention something specific about the company's culture or values found in the JD.
         - **Call to Action**: Confident closing.
       - **Constraint**: Do NOT use placeholders like "[Company Name]" unless you absolutely cannot find it. Infer it from the text if possible.
       - **Constraint**: If user context is provided, you MUST weave it in naturally to make it sound like *they* wrote it.

    3. **OUTPUT**:
       - Return ONLY the body of the letter. No markdown formatting for the letter itself (like bolding), just plain text paragraphs.
    `;

    try {
        return await generateCompletion(prompt, false);
    } catch (error) {
        console.error("AI Cover Letter Error:", error);
        throw error;
    }
};

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export const generateChatCompletion = async (messages: ChatMessage[], context?: string): Promise<string> => {
    const config = await getAIConfig();

    // Construct system prompt with context
    let systemPrompt = `You are an intelligent assistant integrated into the 'Application Tracker' app. 
    Your goal is to help the user with their job search, application tracking, and resume optimization.
    
    Current App Context:
    ${context || "User is browsing the application."}
    
    Be concise, helpful, and professional.`;

    const fullMessages = [
        { role: 'system', content: systemPrompt } as ChatMessage,
        ...messages
    ];

    let prompt = "";
    if (config.provider === 'ollama') {
        // Simple chat-to-text format for generic completion models
        prompt = fullMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n') + "\nASSISTANT:";

        const response = await generateOllama({
            prompt,
            model: config.ollamaModel
        }, config.ollamaUrl);
        return response.text;
    } else {
        // Gemini
        prompt = fullMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n') + "\nASSISTANT:";
        return generateGemini(prompt, false);
    }
};

