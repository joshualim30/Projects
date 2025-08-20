export type InternshipStatus = 
  | 'applied'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_declined'
  | 'rejected'
  | 'withdrawn';

export interface Internship {
  id?: number;
  title: string;
  company_name: string;
  company_location?: string;
  company_website?: string;
  company_logo?: string;
  company_description?: string;
  company_industry?: string;
  company_size?: string;
  position_description?: string;
  salary_range?: string;
  application_date: string;
  status: InternshipStatus;
  interview_date?: string;
  notes?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  application_url?: string;
  resume_version?: string;
  cover_letter_version?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InternshipStats {
  total: number;
  applied: number;
  interview_scheduled: number;
  interview_completed: number;
  offer_received: number;
  offer_accepted: number;
  offer_declined: number;
  rejected: number;
  withdrawn: number;
}

export interface InternshipFilters {
  status?: InternshipStatus;
  company?: string;
  dateFrom?: string;
  dateTo?: string;
  industry?: string;
}
