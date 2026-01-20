import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from '../firebase';

export const getResumeUrl = async (): Promise<string | null> => {
    const storage = getStorage(app);
    const resumeRef = ref(storage, 'resume.pdf'); // Assumption: file is named resume.pdf

    try {
        const url = await getDownloadURL(resumeRef);
        return url;
    } catch (error) {
        console.error("Error fetching resume URL:", error);
        return null;
    }
};
