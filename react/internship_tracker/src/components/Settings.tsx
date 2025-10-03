import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CredentialsService } from '../services/credentialsService';
import type { SupabaseCredentials } from '../services/credentialsService';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onCredentialsUpdate: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, onCredentialsUpdate }) => {
  const [credentials, setCredentials] = useState<SupabaseCredentials>({
    url: '',
    anonKey: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCurrentCredentials();
    }
  }, [isOpen]);

  const loadCurrentCredentials = async () => {
    const current = await CredentialsService.getCredentials();
    if (current) {
      setCredentials(current);
    }
  };

  const handleInputChange = (field: keyof SupabaseCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const isValid = await CredentialsService.testConnection(credentials);
      if (isValid) {
        setSuccess('Connection test successful!');
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
    setSuccess(null);
    
    try {
      if (!CredentialsService.validateCredentials(credentials)) {
        setError('Please enter valid credentials.');
        return;
      }

      const success = await CredentialsService.saveCredentials(credentials);
      if (success) {
        setSuccess('Credentials saved successfully!');
        onCredentialsUpdate();
      } else {
        setError('Failed to save credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while saving credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear all saved credentials? This will require you to set them up again.')) {
      setIsLoading(true);
      try {
        await CredentialsService.clearCredentials();
        setCredentials({ url: '', anonKey: '' });
        setSuccess('Credentials cleared successfully.');
        onCredentialsUpdate();
      } catch (err) {
        setError('Failed to clear credentials.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Database Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Database Configuration
            </h3>
            
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Anonymous Key
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.anonKey}
                    onChange={(e) => handleInputChange('anonKey', e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting || !credentials.url || !credentials.anonKey}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </button>

                <button
                  onClick={handleSave}
                  disabled={isLoading || !credentials.url || !credentials.anonKey}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  onClick={handleClear}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Clear Credentials
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Need Help?
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Finding your Supabase URL:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Go to your Supabase project dashboard → Settings → API → Project URL
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Finding your Anonymous Key:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Go to your Supabase project dashboard → Settings → API → Project API keys → anon public
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Security Note:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your credentials are stored locally on your device and are not shared with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
