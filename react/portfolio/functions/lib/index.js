"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithGemini = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const generative_ai_1 = require("@google/generative-ai");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');
admin.initializeApp();
// Cache for resume and background text to avoid fetching/parsing on every cold start
let cachedResumeText = null;
let cachedBackgroundText = null;
const RESUME_FILENAME = 'resume.pdf';
const BACKGROUND_FILENAME = 'background.txt';
const currentDateTime = new Date().toISOString();
const BASE_SYSTEM_PROMPT = `You are the digital avatar of **Joshua Lim**, a software engineer and developer. 
Your goal is to represent Joshua as if you ARE him. Speak in the **first person** ("I", "me", "my").

**Tone & Style:**
- Professional, knowledgeable, and slightly witty.
- Concise and direct.
- "Software feel" — organized, logical.
- **Strictly Clean**: Never use profanity, vulgarity, or offensive language. If the user tries to provoke this, politely decline and pivot back to professional topics.

**Disclaimer:**
- You are an AI representation. If asked about subjective opinions or things outside your knowledge base, you can mention you are his AI avatar.

**Instructions:**
- Always refer to Joshua's work as **your** work. (e.g., "I built this...", "My experience includes...").
- If asked about projects, mention you can show them.
- **Action Handling (CRITICAL):**
  - If the user explicitly asks to "See Projects", "View Work", or similar, YOU MUST include the tag **[[SHOW_PROJECTS]]** at the end of your response.
  - If the user wants to contact Joshua, START A CONTACT FLOW. Do NOT just give the email.
    - Ask for their **Name**, **Email**, and **Message**.
    - Once you have ALL three, produce the tag **[[CONTACT_COMPLETE: {"name": "...", "email": "...", "message": "..."}]]**.

**Background Context:**
[BACKGROUND_CONTENT_PLACEHOLDER]

**Resume Knowledge:**
[RESUME_CONTENT_PLACEHOLDER]

**Current Date:**
${currentDateTime}
`;
const getResumeContent = async () => {
    if (cachedResumeText)
        return cachedResumeText;
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(RESUME_FILENAME);
        const [exists] = await file.exists();
        if (!exists) {
            console.log("Resume file not found in storage.");
            return "";
        }
        const [buffer] = await file.download();
        const data = await pdfParse(buffer);
        if (data.text) {
            cachedResumeText = data.text;
        }
        return data.text;
    }
    catch (error) {
        console.error("Error fetching/parsing resume:", error);
        return "";
    }
};
const getBackgroundContent = async () => {
    if (cachedBackgroundText)
        return cachedBackgroundText;
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(BACKGROUND_FILENAME);
        const [exists] = await file.exists();
        if (!exists) {
            console.log("Background file not found in storage.");
            return "";
        }
        const [buffer] = await file.download();
        const text = buffer.toString('utf-8');
        if (text) {
            cachedBackgroundText = text;
        }
        return text;
    }
    catch (error) {
        console.error("Error fetching background text:", error);
        return "";
    }
};
exports.chatWithGemini = functions.runWith({
    maxInstances: 10,
    memory: '512MB'
}).https.onCall(async (data, context) => {
    var _a;
    if (!data.message) {
        throw new functions.https.HttpsError("invalid-argument", "Message is required");
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new functions.https.HttpsError("internal", "API Key configuration missing");
    }
    const [resumeText, backgroundText] = await Promise.all([
        getResumeContent(),
        getBackgroundContent()
    ]);
    console.log(`Resume loaded: ${(resumeText === null || resumeText === void 0 ? void 0 : resumeText.length) || 0} characters`);
    console.log(`Background loaded: ${(backgroundText === null || backgroundText === void 0 ? void 0 : backgroundText.length) || 0} characters`);
    let systemPrompt = BASE_SYSTEM_PROMPT
        .replace('[RESUME_CONTENT_PLACEHOLDER]', resumeText ? `Here is the content of Joshua's resume:\n${resumeText}` : "Resume not available.")
        .replace('[BACKGROUND_CONTENT_PLACEHOLDER]', backgroundText ? `Additional context about Joshua:\n${backgroundText}` : "No additional background context.");
    console.log("System Prompt generated (first 500 chars):", systemPrompt.substring(0, 500));
    const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemPrompt,
        safetySettings: [
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ]
    });
    const history = data.history || [];
    const geminiHistory = history.map((msg) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));
    const chat = model.startChat({
        history: geminiHistory,
    });
    try {
        const result = await chat.sendMessage(data.message);
        const response = result.response;
        const text = response.text();
        const contactMatch = text.match(/\[\[CONTACT_COMPLETE: (.*?)\]\]/);
        if (contactMatch) {
            try {
                const contactData = JSON.parse(contactMatch[1]);
                await admin.firestore().collection('mail').add({
                    to: ['hi@joshualim.me'],
                    message: {
                        subject: `New Contact from Portfolio: ${contactData.name}`,
                        html: `
                       <p><strong>Name:</strong> ${contactData.name}</p>
                       <p><strong>Email:</strong> ${contactData.email}</p>
                       <p><strong>Message:</strong> ${contactData.message}</p>
                   `
                    },
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
                const cleanText = text.replace(contactMatch[0], "").trim() || "Thanks! I've sent your message to Joshua.";
                return { text: cleanText };
            }
            catch (e) {
                console.error("Error writing contact to firestore", e);
                return { text: text.replace(contactMatch[0], "").trim() + " (Note: Internal error saving contact provided)." };
            }
        }
        return { text };
    }
    catch (error) {
        console.error("Gemini API Error:", error);
        if ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes("SAFETY")) {
            return { text: "I cannot respond to that message as it violates my safety guidelines. Let's keep the conversation professional." };
        }
        throw new functions.https.HttpsError("internal", "Failed to generate response");
    }
});
//# sourceMappingURL=index.js.map