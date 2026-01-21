import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile } from '../components/Profile';

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

export const analyzeResumeWithGemini = async (resumeText: string, jobDescription: string): Promise<GeminiAnalysisResult> => {
    if (!genAI) throw new Error("Gemini not initialized. Please provide an API Key.");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Cleanup potential markdown formatting
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw new Error("Failed to analyze resume with AI.");
    }
};

export const generateCoverLetterWithGemini = async (resumeText: string, jobDescription: string, profileContext?: UserProfile): Promise<string> => {
    if (!genAI) throw new Error("Gemini not initialized. Please provide an API Key.");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Cover Letter Error:", error);
        throw error;
    }
};
