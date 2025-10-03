import { useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type { Internship, InternshipFilters } from '../types/internship';
import { internshipService } from '../services/internshipService';
import type { InternshipState, InternshipAction, InternshipContextType } from './InternshipContextTypes';

const initialState: InternshipState = {
  internships: [],
  stats: {
    total: 0,
    applied: 0,
    interview_scheduled: 0,
    interview_completed: 0,
    offer_received: 0,
    offer_accepted: 0,
    offer_declined: 0,
    rejected: 0,
    withdrawn: 0,
  },
  loading: false,
  error: null,
  filters: {},
};

function internshipReducer(state: InternshipState, action: InternshipAction): InternshipState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_INTERNSHIPS':
      return { ...state, internships: action.payload };
    case 'ADD_INTERNSHIP':
      return { ...state, internships: [action.payload, ...state.internships] };
    case 'UPDATE_INTERNSHIP':
      return {
        ...state,
        internships: state.internships.map(internship =>
          internship.id === action.payload.id ? action.payload : internship
        ),
      };
    case 'DELETE_INTERNSHIP':
      return {
        ...state,
        internships: state.internships.filter(internship => internship.id !== action.payload),
      };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    default:
      return state;
  }
}

import { InternshipContext } from './InternshipContextInstance';

export function InternshipProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(internshipReducer, initialState);

  const loadStats = useCallback(async () => {
    try {
      const stats = await internshipService.getStats();
      dispatch({ type: 'SET_STATS', payload: stats });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  const loadInternships = useCallback(async (filters?: InternshipFilters) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const internships = await internshipService.getAllInternships(filters);
      dispatch({ type: 'SET_INTERNSHIPS', payload: internships });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load internships' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createInternship = useCallback(async (internship: Omit<Internship, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const newInternship = await internshipService.createInternship(internship);
      dispatch({ type: 'ADD_INTERNSHIP', payload: newInternship });
      await loadStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create internship' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadStats]);

  const updateInternship = useCallback(async (id: number, internship: Partial<Internship>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const updatedInternship = await internshipService.updateInternship(id, internship);
      if (updatedInternship) {
        dispatch({ type: 'UPDATE_INTERNSHIP', payload: updatedInternship });
        await loadStats();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update internship' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadStats]);

  const deleteInternship = useCallback(async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const success = await internshipService.deleteInternship(id);
      if (success) {
        dispatch({ type: 'DELETE_INTERNSHIP', payload: id });
        await loadStats();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete internship' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadStats]);

  const setFilters = useCallback((filters: InternshipFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  useEffect(() => {
    loadInternships();
    loadStats();
  }, []);

  const value: InternshipContextType = {
    state,
    loadInternships,
    createInternship,
    updateInternship,
    deleteInternship,
    loadStats,
    setFilters,
    clearError,
  };

  return (
    <InternshipContext.Provider value={value}>
      {children}
    </InternshipContext.Provider>
  );
}


