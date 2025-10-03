import { getSupabase } from '../db';
import type { Internship, InternshipStats, InternshipFilters } from '../types/internship';

// Demo data for when database is not available
const demoInternships: Internship[] = [
  {
    id: 1,
    company_name: 'Google',
    position: 'Software Engineering Intern',
    status: 'applied',
    application_date: '2024-01-15',
    company_industry: 'Technology',
    location: 'Mountain View, CA',
    salary_range: '$8000 - $10000',
    application_method: 'Company Website',
    contact_person: 'John Smith',
    contact_email: 'john.smith@google.com',
    notes: 'Applied through Google Careers portal',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    company_name: 'Microsoft',
    position: 'Frontend Developer Intern',
    status: 'interview_scheduled',
    application_date: '2024-01-10',
    company_industry: 'Technology',
    location: 'Seattle, WA',
    salary_range: '$7000 - $9000',
    application_method: 'LinkedIn',
    contact_person: 'Sarah Johnson',
    contact_email: 'sarah.johnson@microsoft.com',
    notes: 'First round interview scheduled for next week',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-12T09:15:00Z'
  },
  {
    id: 3,
    company_name: 'Apple',
    position: 'iOS Development Intern',
    status: 'offer_received',
    application_date: '2024-01-05',
    company_industry: 'Technology',
    location: 'Cupertino, CA',
    salary_range: '$9000 - $11000',
    application_method: 'Referral',
    contact_person: 'Mike Davis',
    contact_email: 'mike.davis@apple.com',
    notes: 'Great opportunity! Considering the offer',
    created_at: '2024-01-05T11:20:00Z',
    updated_at: '2024-01-18T16:45:00Z'
  }
];

const demoStats: InternshipStats = {
  total: 3,
  applied: 1,
  interview_scheduled: 1,
  interview_completed: 0,
  offer_received: 1,
  offer_accepted: 0,
  offer_declined: 0,
  rejected: 0,
  withdrawn: 0,
};

export const internshipService = {
  // Check if we're in demo mode (no database connection)
  isDemoMode(): boolean {
    try {
      getSupabase();
      return false;
    } catch {
      return true;
    }
  },

  // Get all internships with optional filters
  async getAllInternships(filters?: InternshipFilters): Promise<Internship[]> {
    if (this.isDemoMode()) {
      console.log('Running in demo mode - showing sample data');
      let filteredData = [...demoInternships];
      
      if (filters) {
        if (filters.status) {
          filteredData = filteredData.filter(item => item.status === filters.status);
        }
        if (filters.company) {
          filteredData = filteredData.filter(item => 
            item.company_name.toLowerCase().includes(filters.company!.toLowerCase())
          );
        }
        if (filters.industry) {
          filteredData = filteredData.filter(item => 
            item.company_industry.toLowerCase().includes(filters.industry!.toLowerCase())
          );
        }
      }
      
      return filteredData;
    }

    const supabase = getSupabase();
    let query = supabase
      .from('internships')
      .select('*')
      .order('application_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (filters) {
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.company) {
        query = query.ilike('company_name', `%${filters.company}%`);
      }
      if (filters.dateFrom) {
        query = query.gte('application_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('application_date', filters.dateTo);
      }
      if (filters.industry) {
        query = query.ilike('company_industry', `%${filters.industry}%`);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get internship by ID
  async getInternshipById(id: number): Promise<Internship | null> {
    if (this.isDemoMode()) {
      return demoInternships.find(internship => internship.id === id) || null;
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new internship
  async createInternship(internship: Omit<Internship, 'id' | 'created_at' | 'updated_at'>): Promise<Internship> {
    if (this.isDemoMode()) {
      console.warn('Demo mode: Cannot create internships without database connection');
      throw new Error('Demo mode: Cannot create internships');
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('internships')
      .insert([internship])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update internship
  async updateInternship(id: number, internship: Partial<Internship>): Promise<Internship | null> {
    if (this.isDemoMode()) {
      console.warn('Demo mode: Cannot update internships without database connection');
      throw new Error('Demo mode: Cannot update internships');
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('internships')
      .update(internship)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete internship
  async deleteInternship(id: number): Promise<boolean> {
    if (this.isDemoMode()) {
      console.warn('Demo mode: Cannot delete internships without database connection');
      throw new Error('Demo mode: Cannot delete internships');
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from('internships')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Get statistics
  async getStats(): Promise<InternshipStats> {
    if (this.isDemoMode()) {
      return demoStats;
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('internships')
      .select('status');

    if (error) throw error;

    const stats: InternshipStats = {
      total: data?.length || 0,
      applied: data?.filter((item: any) => item.status === 'applied').length || 0,
      interview_scheduled: data?.filter((item: any) => item.status === 'interview_scheduled').length || 0,
      interview_completed: data?.filter((item: any) => item.status === 'interview_completed').length || 0,
      offer_received: data?.filter((item: any) => item.status === 'offer_received').length || 0,
      offer_accepted: data?.filter((item: any) => item.status === 'offer_accepted').length || 0,
      offer_declined: data?.filter((item: any) => item.status === 'offer_declined').length || 0,
      rejected: data?.filter((item: any) => item.status === 'rejected').length || 0,
      withdrawn: data?.filter((item: any) => item.status === 'withdrawn').length || 0,
    };

    return stats;
  },

  // Get recent internships
  async getRecentInternships(limit: number = 5): Promise<Internship[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .order('application_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Search internships
  async searchInternships(searchTerm: string): Promise<Internship[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%,company_industry.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
      .order('application_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
