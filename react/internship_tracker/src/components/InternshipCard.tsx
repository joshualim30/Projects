import React from 'react';
import { motion } from 'framer-motion';
import type { Internship } from '../types/internship';
import { getStatusColor, getStatusLabel, getStatusIcon, formatDate } from '../utils/statusUtils';

interface InternshipCardProps {
  internship: Internship;
  onEdit: (internship: Internship) => void;
  onDelete: (id: number) => void;
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship, onEdit, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this internship application?')) {
      onDelete(internship.id!);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      }
    },
  };

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.98 }}
      className="glass-effect rounded-2xl p-6 cursor-pointer group hover:enhanced-shadow transition-all duration-300 card-shadow"
      onClick={() => onEdit(internship)}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 min-w-0">
          <motion.h3 
            className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            whileHover={{ x: 2 }}
          >
            {internship.title}
          </motion.h3>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {internship.company_name}
          </p>
          {internship.company_location && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span className="mr-1">📍</span>
              {internship.company_location}
            </div>
          )}
        </div>
        <div className="flex space-x-2 ml-4">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(internship);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </motion.button>
          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Applied:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {formatDate(internship.application_date)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
          <motion.span 
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(internship.status)}`}
            whileHover={{ scale: 1.05 }}
          >
            <span className="mr-1">{getStatusIcon(internship.status)}</span>
            {getStatusLabel(internship.status)}
          </motion.span>
        </div>

        {internship.interview_date && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Interview:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatDate(internship.interview_date)}
            </span>
          </div>
        )}

        {internship.salary_range && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Salary:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {internship.salary_range}
            </span>
          </div>
        )}

        {internship.company_industry && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Industry:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {internship.company_industry}
            </span>
          </div>
        )}

        {internship.notes && (
          <div className="mt-4 p-3 bg-pastel-100 dark:bg-dark-700 rounded-lg border border-pastel-200 dark:border-dark-600">
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {internship.notes}
            </p>
          </div>
        )}

        {internship.application_url && (
          <motion.div 
            className="mt-4"
            whileHover={{ x: 4 }}
          >
            <a
              href={internship.application_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View Application
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default InternshipCard;
