import { useContext } from 'react';
import { InternshipContext } from '../context/InternshipContextInstance';

export function useInternships() {
  const context = useContext(InternshipContext);
  if (context === undefined) {
    throw new Error('useInternships must be used within an InternshipProvider');
  }
  return context;
}
