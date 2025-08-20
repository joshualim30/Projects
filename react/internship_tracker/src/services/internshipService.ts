import supabase from '../db';
import type { Internship, InternshipStats, InternshipFilters } from '../types/internship';

export const internshipService = {
  // Get all internships with optional filters
  async getAllInternships(filters?: InternshipFilters): Promise<Internship[]> {
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
    const { error } = await supabase
      .from('internships')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Get statistics
  async getStats(): Promise<InternshipStats> {
    const { data, error } = await supabase
      .from('internships')
      .select('status');

    if (error) throw error;

    const stats: InternshipStats = {
      total: data?.length || 0,
      applied: data?.filter(item => item.status === 'applied').length || 0,
      interview_scheduled: data?.filter(item => item.status === 'interview_scheduled').length || 0,
      interview_completed: data?.filter(item => item.status === 'interview_completed').length || 0,
      offer_received: data?.filter(item => item.status === 'offer_received').length || 0,
      offer_accepted: data?.filter(item => item.status === 'offer_accepted').length || 0,
      offer_declined: data?.filter(item => item.status === 'offer_declined').length || 0,
      rejected: data?.filter(item => item.status === 'rejected').length || 0,
      withdrawn: data?.filter(item => item.status === 'withdrawn').length || 0,
    };

    return stats;
  },

  // Get recent internships
  async getRecentInternships(limit: number = 5): Promise<Internship[]> {
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
