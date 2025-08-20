import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Internship, InternshipFilters, InternshipStatus } from '../types/internship';
import { statusOptions } from '../utils/statusUtils';
import InternshipCard from './InternshipCard';
import { getStatusColor, getStatusLabel, getStatusIcon, formatDate } from '../utils/statusUtils';

interface InternshipListProps {
  internships: Internship[];
  onEdit: (internship: Internship) => void;
  onDelete: (id: number) => void;
  onFilterChange: (filters: InternshipFilters) => void;
  loading?: boolean;
  viewMode?: 'cards' | 'grid';
}

const InternshipList: React.FC<InternshipListProps> = ({
  internships,
  onEdit,
  onDelete,
  onFilterChange,
  loading = false,
  viewMode = 'cards',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Parse search term for field-specific search
  const parseSearchTerm = (term: string) => {
    const fieldPrefixes = {
      'company:': 'company_name',
      'position:': 'title',
      'status:': 'status',
      'location:': 'company_location',
      'industry:': 'company_industry',
      'contact:': 'contact_person',
      'email:': 'contact_email',
      'notes:': 'notes',
      'salary:': 'salary_range',
      'url:': 'application_url',
      'website:': 'company_website'
    };

    const lowerTerm = term.toLowerCase();
    for (const [prefix, field] of Object.entries(fieldPrefixes)) {
      if (lowerTerm.startsWith(prefix)) {
        return {
          type: 'field' as const,
          field,
          value: term.substring(prefix.length).trim()
        };
      }
    }

    return {
      type: 'keyword' as const,
      value: term
    };
  };

  const handleFilterChange = () => {
    const filters: InternshipFilters = {};
    if (statusFilter) filters.status = statusFilter as InternshipStatus;
    onFilterChange(filters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll just filter locally
    // In a real app, you might want to send this to the backend
  };

  // Smart search filtering with edge case handling
  const filteredInternships = useMemo(() => {
    if (!searchTerm.trim() && !statusFilter) {
      return internships;
    }

    return internships.filter((internship) => {
      // Apply status filter
      if (statusFilter && internship.status !== statusFilter) {
        return false;
      }

      // Apply search filter
      if (searchTerm.trim()) {
        const searchQuery = parseSearchTerm(searchTerm);
        
        if (searchQuery.type === 'field') {
          const fieldValue = internship[searchQuery.field as keyof Internship];
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(searchQuery.value.toLowerCase());
          }
          return false;
        } else {
          // Keyword search across all major fields
          const searchValue = searchQuery.value.toLowerCase();
          const searchableFields = [
            internship.title,
            internship.company_name,
            internship.company_location,
            internship.company_industry,
            internship.contact_person,
            internship.contact_email,
            internship.notes,
            internship.salary_range,
            internship.application_url,
            internship.company_website
          ].filter(Boolean);

          return searchableFields.some(field => 
            field && field.toLowerCase().includes(searchValue)
          );
        }
      }

      return true;
    });
  }, [internships, searchTerm, statusFilter]);

  // Get search suggestions based on current input
  const getSearchSuggestions = () => {
    if (!searchTerm.trim()) return [];
    
    const suggestions: string[] = [];
    const lowerTerm = searchTerm.toLowerCase();
    
    // Field prefix suggestions
    const fieldPrefixes = [
      'company:', 'position:', 'status:', 'location:', 'industry:', 
      'contact:', 'email:', 'notes:', 'salary:', 'url:', 'website:'
    ];
    
    fieldPrefixes.forEach(prefix => {
      if (prefix.startsWith(lowerTerm)) {
        suggestions.push(prefix);
      }
    });

    // If it's a field-specific search, show values for that field
    const searchQuery = parseSearchTerm(searchTerm);
    if (searchQuery.type === 'field') {
      const uniqueValues = [...new Set(
        internships
          .map(internship => internship[searchQuery.field as keyof Internship])
          .filter((value): value is string => !!value && typeof value === 'string')
      )];
      
      uniqueValues.forEach(value => {
        if (value.toLowerCase().includes(searchQuery.value.toLowerCase())) {
          suggestions.push(`${searchQuery.field}: ${value}`);
        }
      });
    } else {
      // Keyword suggestions from existing data
      const allValues = internships.flatMap(internship => [
        internship.title,
        internship.company_name,
        internship.company_location,
        internship.company_industry,
        internship.contact_person,
        internship.contact_email
      ]).filter(Boolean);
      
      const uniqueValues = [...new Set(allValues)];
      uniqueValues.forEach(value => {
        if (value && value.toLowerCase().includes(lowerTerm)) {
          suggestions.push(value);
        }
      });
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  };

  const searchSuggestions = getSearchSuggestions();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Table view variants
  const tableContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Table component
  const InternshipTable = () => (
    <motion.div
      variants={tableContainerVariants}
      initial="hidden"
      animate="visible"
      className="glass-effect rounded-2xl overflow-hidden enhanced-shadow"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-pastel-100 dark:bg-dark-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Applied
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Salary
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pastel-200 dark:divide-dark-600">
            {filteredInternships.map((internship, index) => (
              <motion.tr
                key={internship.id}
                variants={tableRowVariants}
                custom={index}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                className="hover:bg-pastel-50 dark:hover:bg-dark-800/50 transition-colors cursor-pointer"
                onClick={() => onEdit(internship)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {internship.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {internship.company_name}
                  </div>
                  {internship.company_industry && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {internship.company_industry}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {internship.company_location || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(internship.application_date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(internship.status)}`}>
                    <span className="mr-1">{getStatusIcon(internship.status)}</span>
                    {getStatusLabel(internship.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {internship.salary_range || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(internship);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this internship application?')) {
                          onDelete(internship.id!);
                        }
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-2xl p-6 enhanced-shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Smart Search */}
          <div className="md:col-span-2">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by keyword or field (e.g., 'Company: Google' or 'Ap')..."
                  className="form-input pl-12"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Search Suggestions */}
                <AnimatePresence>
                  {searchSuggestions.length > 0 && searchTerm.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-pastel-200 dark:border-dark-700 z-50 max-h-60 overflow-y-auto"
                    >
                      {searchSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSearchTerm(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-pastel-100 dark:hover:bg-dark-700 text-sm text-gray-700 dark:text-gray-300 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
            
            {/* Search Help Text */}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Search tips:</span> Use prefixes like "Company:", "Position:", "Status:" for specific fields, or type keywords to search across all fields.
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                handleFilterChange();
              }}
              className="form-select"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loading ? 'Loading...' : `${filteredInternships.length} internship${filteredInternships.length !== 1 ? 's' : ''} found`}
        </p>
        <motion.button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('');
            onFilterChange({});
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
        >
          Clear filters
        </motion.button>
      </motion.div>

      {/* Internship Cards/Table */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 animate-pulse enhanced-shadow"
              >
                <div className="space-y-4">
                  <div className="h-4 bg-pastel-300 dark:bg-dark-600 rounded w-3/4"></div>
                  <div className="h-3 bg-pastel-300 dark:bg-dark-600 rounded w-1/2"></div>
                  <div className="h-3 bg-pastel-300 dark:bg-dark-600 rounded w-2/3"></div>
                  <div className="h-3 bg-pastel-300 dark:bg-dark-600 rounded w-1/3"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : filteredInternships.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center py-16"
          >
            <motion.div 
              className="text-gray-400 dark:text-gray-500 text-8xl mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              📝
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              No internships found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm || statusFilter 
                ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                : 'Get started by adding your first internship application to begin tracking your job search journey!'
              }
            </p>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <InternshipTable />
        ) : (
          <motion.div
            key="cards"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredInternships.map((internship, index) => (
              <motion.div
                key={internship.id}
                variants={itemVariants}
                custom={index}
              >
                <InternshipCard
                  internship={internship}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InternshipList;
