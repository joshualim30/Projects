import React from 'react';
import { motion } from 'framer-motion';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
  onOpenSettings: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry, onOpenSettings }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
      >
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Connection Error
        </h2>

        {/* Error Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error}
        </p>

        {/* Error Details */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Possible Solutions:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Check your internet connection</li>
            <li>• Verify your Supabase credentials</li>
            <li>• Ensure your Supabase project is active</li>
            <li>• Check if your database is accessible</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={onOpenSettings}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Open Settings
          </button>
        </div>

        {/* Help Link */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Check out the{' '}
            <a
              href="https://supabase.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Supabase documentation
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
