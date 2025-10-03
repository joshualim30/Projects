import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useInternships } from '../hooks/useInternships';
import { internshipService } from '../services/internshipService';
import Logo from '../assets/internship_tracker_logo.png';

// TypeScript declarations for Electron API
declare global {
  interface Window {
    electronAPI?: {
      getAppVersion: () => Promise<string>;
      getAppName: () => Promise<string>;
      getAppInfo: () => Promise<any>;
      onMenuNewInternship: (callback: () => void) => void;
      onMenuAbout: (callback: () => void) => void;
      onMenuImportData: (callback: () => void) => void;
      onMenuExportData: (callback: () => void) => void;
      onMenuPreferences: (callback: () => void) => void;
      onMenuToggleView: (callback: (view: string) => void) => void;
      onMenuShortcuts: (callback: () => void) => void;
      onMenuCheckUpdates: (callback: () => void) => void;
      showSaveDialog: (options: any) => Promise<any>;
      showOpenDialog: (options: any) => Promise<any>;
      showMessageBox: (options: any) => Promise<any>;
      removeAllListeners: (channel: string) => void;
    };
  }
}

interface LayoutProps {
  children: React.ReactNode;
  viewMode?: 'cards' | 'grid';
  onViewModeChange?: (mode: 'cards' | 'grid') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, viewMode = 'cards', onViewModeChange }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { state } = useInternships();
  const isDemoMode = internshipService.isDemoMode();



  const handleViewToggle = () => {
    const newMode = viewMode === 'cards' ? 'grid' : 'cards';
    onViewModeChange?.(newMode);
  };

  const handleExport = () => {
    if (!state.internships || state.internships.length === 0) {
      return;
    }

    // Convert live internship data to CSV format
    const headers = [
      'Position Title',
      'Company Name',
      'Company Location',
      'Application Date',
      'Status',
      'Salary Range',
      'Interview Date',
      'Notes',
      'Company Website',
      'Company Industry',
      'Contact Person',
      'Contact Email',
      'Contact Phone',
      'Application URL'
    ];

    const csvContent = [
      headers.join(','),
      ...state.internships.map(internship => [
        `"${internship.title || ''}"`,
        `"${internship.company_name || ''}"`,
        `"${internship.company_location || ''}"`,
        `"${internship.application_date || ''}"`,
        `"${internship.status || ''}"`,
        `"${internship.salary_range || ''}"`,
        `"${internship.interview_date || ''}"`,
        `"${internship.notes || ''}"`,
        `"${internship.company_website || ''}"`,
        `"${internship.company_industry || ''}"`,
        `"${internship.contact_person || ''}"`,
        `"${internship.contact_email || ''}"`,
        `"${internship.contact_phone || ''}"`,
        `"${internship.application_url || ''}"`
      ].join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `internship-tracker-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const hasInternships = state.internships && state.internships.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-50 via-white to-soft-blue dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 flex flex-col">
      {/* Title Bar spacer: visible on macOS, harmless on others */}
      <div className="mac-titlebar"></div>
      
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-yellow-100 border-b border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-center text-sm text-yellow-800 dark:text-yellow-200">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Demo Mode: Showing sample data. Create a .env file with your Supabase credentials to connect to your database.
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-effect sticky top-0 z-50 border-b border-pastel-200/50 dark:border-dark-700/50 shadow-lg mac-content"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                  <img 
                    src={Logo} 
                    alt="Internship Tracker Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Internship Tracker
              </h1>
            </motion.div>
            
            <nav className="flex items-center space-x-3">
              {/* View Toggle Button */}
              <motion.button
                onClick={handleViewToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-pastel-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-dark-700'
                }`}
                title={`Switch to ${viewMode === 'cards' ? 'Table' : 'Card'} View`}
              >
                {viewMode === 'cards' ? (
                  // Table/Grid icon for switching to table view
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ) : (
                  // Cards/Grid icon for switching to card view
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
              </motion.button>

              {/* Export Button */}
              <motion.button
                onClick={handleExport}
                disabled={!hasInternships}
                whileHover={hasInternships ? { scale: 1.05 } : {}}
                whileTap={hasInternships ? { scale: 0.95 } : {}}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  hasInternships
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-pastel-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-dark-700'
                    : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                }`}
                title={hasInternships ? "Export to CSV" : "No internships to export"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </motion.button>

              {/* Filter Button */}
              <motion.button
                onClick={handleAdvancedFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  showAdvancedFilters
                    ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-pastel-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-dark-700'
                }`}
                title="Advanced Filters"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </motion.button>
            </nav>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-pastel-200/50 dark:border-dark-700/50 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date Range
                    </label>
                    <select className="form-select text-sm">
                      <option>All Time</option>
                      <option>Last 30 Days</option>
                      <option>Last 3 Months</option>
                      <option>Last 6 Months</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Salary Range
                    </label>
                    <select className="form-select text-sm">
                      <option>Any</option>
                      <option>$0 - $25/hour</option>
                      <option>$25 - $50/hour</option>
                      <option>$50+ /hour</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Size
                    </label>
                    <select className="form-select text-sm">
                      <option>Any</option>
                      <option>Startup (1-50)</option>
                      <option>Small (51-200)</option>
                      <option>Medium (201-1000)</option>
                      <option>Large (1000+)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 mac-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-effect border-t border-pastel-200/50 dark:border-dark-700/50 shadow-lg mac-content"
      >
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Joshua Lim • Internship Tracker
            </p>
            <div className="flex space-x-6 text-lg">
              <a
                href="https://github.com/joshualim30"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                {/* GitHub Octicon */}
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.421-.012 2.751 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" clipRule="evenodd"/>
                </svg>
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/joshualim30/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                {/* LinkedIn Official Icon */}
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Layout;
