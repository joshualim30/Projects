export type ApplicationStatus =
    | 'applied'
    | 'interview_scheduled'
    | 'interview_completed'
    | 'offer_received'
    | 'offer_accepted'
    | 'offer_declined'
    | 'rejected'
    | 'withdrawn';

export interface Application {
    id: number;
    title: string;
    company_name: string;
    company_location?: string;
    company_website?: string;
    company_logo?: string;
    company_description?: string;
    company_industry?: string;
    company_size?: string;
    position_description?: string;
    salary_range?: string; // Legacy
    salary_min?: number;
    salary_max?: number;
    currency?: string;
    locations?: string[];
    rejection_source?: 'me' | 'them';
    rejection_reason?: string;
    interview_stages?: {
        id: string;
        name: string; // 'Screening', 'Technical', 'System Design'
        date?: string;
        completed: boolean;
        notes?: string;
    }[];
    application_date: string;
    status: ApplicationStatus;
    interview_date?: string; // Legacy
    notes?: string;
    contact_person?: string;
    contact_email?: string;
    contact_phone?: string;
    application_url?: string;
    resume_version?: string;
    cover_letter_version?: string;
    created_at: string;
    updated_at: string;
}

export interface SupabaseConfig {
    url: string;
    key: string;
}

export type AppDocumentType = 'resume' | 'cover_letter' | 'other';

export interface AppDocument {
    id: string;
    user_id: string;
    name: string;
    type: AppDocumentType;
    content: string;
    version: string;
    created_at: string;
}
