import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CredentialsService } from '../services/credentialsService';
import type { SupabaseCredentials } from '../services/credentialsService';

interface SetupWizardProps {
  onComplete: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState<SupabaseCredentials>({
    url: '',
    anonKey: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleInputChange = (field: keyof SupabaseCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!credentials.url.trim()) {
        setError('Supabase URL is required');
        return false;
      }
      try {
        new URL(credentials.url);
      } catch {
        setError('Please enter a valid URL');
        return false;
      }
    }
    
    if (step === 2) {
      if (!credentials.anonKey.trim()) {
        setError('Anonymous key is required');
        return false;
      }
      if (credentials.anonKey.length < 50) {
        setError('Anonymous key appears to be too short');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setError(null);
    
    try {
      const isValid = await CredentialsService.testConnection(credentials);
      if (isValid) {
        setStep(4); // Success step
      } else {
        setError('Connection failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection test failed. Please try again.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await CredentialsService.saveCredentials(credentials);
      if (success) {
        onComplete();
      } else {
        setError('Failed to save credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while saving credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to Internship Tracker
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Let's set up your Supabase database connection to get started.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  value={credentials.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You can find this in your Supabase project settings.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Anonymous Key
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your Supabase anonymous key to connect to the database.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Anonymous Key
                </label>
                <input
                  type="password"
                  value={credentials.anonKey}
                  onChange={(e) => handleInputChange('anonKey', e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You can find this in your Supabase project API settings.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Test Connection
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Let's verify your credentials work before saving them.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Configuration Summary</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">URL:</span>
                    <span className="ml-2 text-gray-900 dark:text-white font-mono">{credentials.url}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Key:</span>
                    <span className="ml-2 text-gray-900 dark:text-white font-mono">
                      {credentials.anonKey.substring(0, 20)}...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Connection Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your Supabase credentials are working correctly. Ready to save and start using the app.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {step} of 4
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((step / 4) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 && step < 4 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Back
            </button>
          )}
          
          <div className="ml-auto space-x-3">
            {step === 3 && (
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
            )}
            
            {step === 4 && (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save & Continue'}
              </button>
            )}
            
            {step < 3 && (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
