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
    html?: string;
}

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

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
            const errorData = await listRes.json().catch(() => ({}));
            console.error('Gmail API Error Details:', JSON.stringify(errorData, null, 2));
            throw new Error(`Gmail API error: ${listRes.status} ${listRes.statusText} - ${errorData.error?.message || 'Unknown error'}`);
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
            const subject = decodeHtml(headers.find(h => h.name === 'Subject')?.value || '(No Subject)');
            const from = decodeHtml(headers.find(h => h.name === 'From')?.value || '(Unknown)');
            const date = headers.find(h => h.name === 'Date')?.value || '';

            // Decode body (checking parts if necessary)
            let body = ''; // Plain text
            let html = ''; // HTML content

            const decodePart = (data: string) => atob(data.replace(/-/g, '+').replace(/_/g, '/'));

            if (detailData.payload.body?.data) {
                // Single part message - usually html if not specified, but could be plain
                const decoded = decodePart(detailData.payload.body.data);
                body = decoded;
                html = decoded; // Assume it might be HTML if it's the only body
            } else if (detailData.payload.parts) {
                // Multipart message
                const findPart = (parts: any[], mimeType: string): string | null => {
                    for (const part of parts) {
                        if (part.mimeType === mimeType && part.body?.data) {
                            return decodePart(part.body.data);
                        }
                        if (part.parts) {
                            const found = findPart(part.parts, mimeType);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                html = findPart(detailData.payload.parts, 'text/html') || '';
                body = findPart(detailData.payload.parts, 'text/plain') || html.replace(/<[^>]*>?/gm, ''); // Fallback to stripping HTML if no plain text
            }

            return {
                id: msg.id,
                threadId: msg.threadId,
                subject,
                from,
                date,
                snippet: decodeHtml(detailData.snippet),
                body,
                html
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
