import type { Internship, InternshipStats, InternshipFilters } from '../types/internship';

export interface InternshipState {
  internships: Internship[];
  stats: InternshipStats;
  loading: boolean;
  error: string | null;
  filters: InternshipFilters;
}

export type InternshipAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INTERNSHIPS'; payload: Internship[] }
  | { type: 'ADD_INTERNSHIP'; payload: Internship }
  | { type: 'UPDATE_INTERNSHIP'; payload: Internship }
  | { type: 'DELETE_INTERNSHIP'; payload: number }
  | { type: 'SET_STATS'; payload: InternshipStats }
  | { type: 'SET_FILTERS'; payload: InternshipFilters };

export interface InternshipContextType {
  state: InternshipState;
  loadInternships: (filters?: InternshipFilters) => Promise<void>;
  createInternship: (internship: Omit<Internship, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateInternship: (id: number, internship: Partial<Internship>) => Promise<void>;
  deleteInternship: (id: number) => Promise<void>;
  loadStats: () => Promise<void>;
  setFilters: (filters: InternshipFilters) => void;
  clearError: () => void;
}
