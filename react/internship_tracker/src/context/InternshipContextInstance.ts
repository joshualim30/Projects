import { createContext } from 'react';
import type { InternshipContextType } from './InternshipContextTypes';

export const InternshipContext = createContext<InternshipContextType | undefined>(undefined);
