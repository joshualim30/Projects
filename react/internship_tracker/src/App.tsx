import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import StatsCards from './components/StatsCards';
import InternshipList from './components/InternshipList';
import InternshipForm from './components/InternshipForm';
import Modal from './components/Modal';
import { useInternships } from './hooks/useInternships';
import type { Internship, InternshipFilters } from './types/internship';

function App() {
  const { state, createInternship, updateInternship, deleteInternship, loadInternships, setFilters, clearError } = useInternships();
  const [showForm, setShowForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | undefined>();
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards');

  const handleAddInternship = () => {
    setEditingInternship(undefined);
    setShowForm(true);
  };

  const handleEditInternship = (internship: Internship) => {
    setEditingInternship(internship);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: Omit<Internship, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingInternship) {
        await updateInternship(editingInternship.id!, data);
      } else {
        await createInternship(data);
      }
      setShowForm(false);
      setEditingInternship(undefined);
    } catch (error) {
      console.error('Error saving internship:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingInternship(undefined);
  };

  const handleDeleteInternship = async (id: number) => {
    try {
      await deleteInternship(id);
    } catch (error) {
      console.error('Error deleting internship:', error);
    }
  };

  const handleFilterChange = (filters: InternshipFilters) => {
    setFilters(filters);
    loadInternships(filters);
  };

  const handleViewModeChange = (mode: 'cards' | 'grid') => {
    setViewMode(mode);
  };

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

  return (
    <Layout viewMode={viewMode} onViewModeChange={handleViewModeChange}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Error Display */}
        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{state.error}</p>
                  </div>
                  <div className="mt-4">
                    <motion.button
                      onClick={clearError}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-50 dark:bg-red-900/30 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 dark:focus:ring-offset-red-900/30 focus:ring-red-600 dark:focus:ring-red-400"
                    >
                      Dismiss
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Section */}
        <motion.div 
          variants={itemVariants}
          className="glass-effect rounded-3xl p-8 enhanced-shadow"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex-1">
              <motion.h2 
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Welcome to Internship Tracker
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Track your internship applications, monitor their status, and stay organized in your job search journey.
              </motion.p>
            </div>
            <motion.button
              onClick={handleAddInternship}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 group"
            >
              <motion.svg 
                className="h-6 w-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </motion.svg>
              <span>Add Internship</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants}>
          <motion.h3 
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Application Statistics
          </motion.h3>
          <StatsCards stats={state.stats} />
        </motion.div>

        {/* Internship List */}
        <motion.div variants={itemVariants}>
          <motion.h3 
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Your Applications
          </motion.h3>
          <InternshipList
            internships={state.internships}
            onEdit={handleEditInternship}
            onDelete={handleDeleteInternship}
            onFilterChange={handleFilterChange}
            loading={state.loading}
            viewMode={viewMode}
          />
        </motion.div>
      </motion.div>

      {/* Internship Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleFormCancel}
        title={editingInternship ? 'Edit Internship' : 'Add New Internship'}
        size="2xl"
      >
        <InternshipForm
          internship={editingInternship}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={state.loading}
          existingInternships={state.internships}
        />
      </Modal>
    </Layout>
  );
}

export default App;
