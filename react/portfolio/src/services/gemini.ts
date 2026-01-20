import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase';

// Ensure functions is initialized
const functions = getFunctions(app, 'us-central1');
// Use the emulator if localhost (optional, but good for dev)
// import { connectFunctionsEmulator } from 'firebase/functions';
// connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export const generateResponse = async (message: string, history: any[] = []) => {
    const chatFunction = httpsCallable(functions, 'chatWithGemini');
    try {
        const result = await chatFunction({ message, history });
        const data = result.data as { text: string };
        return data.text;
    } catch (error) {
        console.error("Error calling chatWithGemini:", error);
        return "I'm having trouble connecting to my brain right now. Please try again later.";
    }
};
