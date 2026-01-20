import { getGoogleAccessToken } from './firebase';

export interface GmailMessage {
    id: string;
    threadId: string;
    snippet: string;
    payload: {
        headers: { name: string; value: string }[];
        body: { data?: string };
        parts?: { body: { data?: string }; mimeType: string }[];
    };
    internalDate: string;
}

export interface Email {
    id: string;
    threadId: string;
    subject: string;
    from: string;
    date: string;
    snippet: string;
    body: string;
}

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

export const searchGmail = async (query: string, maxResults = 20): Promise<Email[]> => {
    const token = getGoogleAccessToken();
    if (!token) throw new Error('No Google Access Token found');

    const searchUrl = new URL(`${GMAIL_API_BASE}/messages`);
    searchUrl.searchParams.append('q', query);
    searchUrl.searchParams.append('maxResults', maxResults.toString());

    try {
        const listRes = await fetch(searchUrl.toString(), {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!listRes.ok) {
            throw new Error(`Gmail API error: ${listRes.statusText}`);
        }

        const listData = await listRes.json();
        const messages = listData.messages as { id: string; threadId: string }[];

        if (!messages || messages.length === 0) return [];

        // Fetch details for each message
        const emailPromises = messages.map(async (msg) => {
            const detailRes = await fetch(`${GMAIL_API_BASE}/messages/${msg.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const detailData: GmailMessage = await detailRes.json();

            const headers = detailData.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
            const from = headers.find(h => h.name === 'From')?.value || '(Unknown)';
            const date = headers.find(h => h.name === 'Date')?.value || '';

            // Decode body (checking parts if necessary)
            let body = '';
            if (detailData.payload.body?.data) {
                body = atob(detailData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            } else if (detailData.payload.parts) {
                const part = detailData.payload.parts.find(p => p.mimeType === 'text/plain') || detailData.payload.parts[0];
                if (part?.body?.data) {
                    body = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                }
            }

            return {
                id: msg.id,
                threadId: msg.threadId,
                subject,
                from,
                date,
                snippet: detailData.snippet,
                body
            };
        });

        return await Promise.all(emailPromises);

    } catch (error) {
        console.error('Error searching Gmail:', error);
        throw error;
    }
};

export const constructJobSearchQuery = (companyName?: string, keywords?: string[]) => {
    // Default keywords for job hunting
    const defaultKeywords = [
        "application", "interview", "offer", "rejection", "update",
        "\"we are happy to inform\"", "\"unfortunately\"",
        "\"thank you for your interest\"", "\"next steps\"",
        "\"hiring team\"", "\"talent acquisition\"", "recruiter"
    ];

    const allKeywords = keywords ? [...defaultKeywords, ...keywords] : defaultKeywords;
    const keywordQuery = `(${allKeywords.join(' OR ')})`;

    if (companyName && companyName !== 'all') {
        return `"${companyName}" ${keywordQuery}`;
    }

    return keywordQuery;
};
