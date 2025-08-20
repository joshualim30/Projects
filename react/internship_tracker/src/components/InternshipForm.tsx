import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import type { Internship } from '../types/internship';
import { statusOptions } from '../utils/statusUtils';
import { AnimatePresence } from 'framer-motion';

interface InternshipFormProps {
  internship?: Internship;
  onSubmit: (data: Omit<Internship, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  loading?: boolean;
  existingInternships?: Internship[]; // For autocomplete
}

const InternshipForm: React.FC<InternshipFormProps> = ({ 
  internship, 
  onSubmit, 
  onCancel, 
  loading = false,
  existingInternships = []
}) => {
  const [isEditing] = useState(!!internship);
  const [showAutocomplete, setShowAutocomplete] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<Internship>();

  const status = watch('status');
  const title = watch('title');
  const companyName = watch('company_name');
  const companyLocation = watch('company_location');
  const companyIndustry = watch('company_industry');
  const contactPerson = watch('contact_person');
  const contactEmail = watch('contact_email');

  useEffect(() => {
    if (internship) {
      reset(internship);
    }
  }, [internship, reset]);

  // Calculate completion status for each step
  const getStepCompletion = () => {
    const step1Complete = !!(title && companyName);
    const step2Complete = !!(companyLocation || companyIndustry);
    const step3Complete = !!(status);
    const step4Complete = !!(contactPerson || contactEmail);
    
    return [step1Complete, step2Complete, step3Complete, step4Complete];
  };

  const stepCompletion = getStepCompletion();

  // Get unique values for autocomplete
  const getUniqueValues = (field: keyof Internship) => {
    const values = existingInternships
      .map(internship => internship[field])
      .filter((value): value is string => !!value && typeof value === 'string')
      .filter((value, index, arr) => arr.indexOf(value) === index);
    return values;
  };

  // Get autocomplete suggestions
  const getAutocompleteSuggestions = (field: string, currentValue: string) => {
    if (!currentValue || currentValue.length < 1) return [];
    
    const uniqueValues = getUniqueValues(field as keyof Internship);
    return uniqueValues
      .filter(value => value.toLowerCase().includes(currentValue.toLowerCase()))
      .slice(0, 5); // Limit to 5 suggestions
  };

  const handleAutocompleteSelect = (field: string, value: string) => {
    setValue(field as keyof Internship, value);
    setShowAutocomplete(null);
  };

  const handleFormSubmit = (data: Internship) => {
    const formData: Omit<Internship, 'id' | 'created_at' | 'updated_at'> = {
      ...data,
      application_date: data.application_date || new Date().toISOString().split('T')[0],
      status: data.status || 'applied',
    };
    onSubmit(formData);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const steps = [
    { id: 1, title: 'Basic Info', icon: '📝' },
    { id: 2, title: 'Company Details', icon: '🏢' },
    { id: 3, title: 'Application', icon: '📋' },
    { id: 4, title: 'Additional Info', icon: '📄' },
  ];

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fieldVariants} className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isEditing ? 'Edit Internship' : 'Add New Internship'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditing ? 'Update your internship application details' : 'Track your new internship application'}
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div variants={fieldVariants} className="mb-8">
        <div className="flex justify-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                stepCompletion[step.id - 1]
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 border-gray-300 dark:border-dark-600 text-gray-500 dark:text-gray-400'
              }`}>
                <span className="text-sm">{step.icon}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                  stepCompletion[step.id] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-dark-600'
                }`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Step 1: Basic Information */}
        <motion.div variants={fieldVariants} className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              stepCompletion[0] 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }`}>
              <span className="text-sm font-semibold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Basic Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Position Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Position title is required' })}
                className="form-input"
                placeholder="e.g., Software Engineering Intern"
                onFocus={() => setShowAutocomplete('title')}
                onBlur={() => setTimeout(() => setShowAutocomplete(null), 200)}
              />
              {showAutocomplete === 'title' && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {getAutocompleteSuggestions('title', title || '').map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                      onClick={() => handleAutocompleteSelect('title', suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              {errors.title && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.title.message}
                </motion.p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Company Name *
              </label>
              <input
                type="text"
                {...register('company_name', { required: 'Company name is required' })}
                className="form-input"
                placeholder="e.g., Google"
                onFocus={() => setShowAutocomplete('company_name')}
                onBlur={() => setTimeout(() => setShowAutocomplete(null), 200)}
              />
              {showAutocomplete === 'company_name' && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {getAutocompleteSuggestions('company_name', companyName || '').map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                      onClick={() => handleAutocompleteSelect('company_name', suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              {errors.company_name && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.company_name.message}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Step 2: Company Information */}
        <motion.div variants={fieldVariants} className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              stepCompletion[1] 
                ? 'bg-green-600 text-white' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            }`}>
              <span className="text-sm font-semibold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Company Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Company Location
              </label>
              <input
                type="text"
                {...register('company_location')}
                className="form-input"
                placeholder="e.g., Mountain View, CA"
                onFocus={() => setShowAutocomplete('company_location')}
                onBlur={() => setTimeout(() => setShowAutocomplete(null), 200)}
              />
              {showAutocomplete === 'company_location' && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {getAutocompleteSuggestions('company_location', companyLocation || '').map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                      onClick={() => handleAutocompleteSelect('company_location', suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Company Website
              </label>
              <input
                type="url"
                {...register('company_website')}
                className="form-input"
                placeholder="https://company.com"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Company Industry
              </label>
              <input
                type="text"
                {...register('company_industry')}
                className="form-input"
                placeholder="e.g., Technology"
                onFocus={() => setShowAutocomplete('company_industry')}
                onBlur={() => setTimeout(() => setShowAutocomplete(null), 200)}
              />
              {showAutocomplete === 'company_industry' && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {getAutocompleteSuggestions('company_industry', companyIndustry || '').map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                      onClick={() => handleAutocompleteSelect('company_industry', suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Company Size
              </label>
              <select {...register('company_size')} className="form-select">
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1001-5000">1001-5000 employees</option>
                <option value="5001-10000">5001-10000 employees</option>
                <option value="10000+">10000+ employees</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Step 3: Application Details */}
        <motion.div variants={fieldVariants} className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              stepCompletion[2] 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            }`}>
              <span className="text-sm font-semibold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Application Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Application Date *
              </label>
              <input
                type="date"
                {...register('application_date', { required: 'Application date is required' })}
                className="form-input"
              />
              {errors.application_date && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.application_date.message}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Status *
              </label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="form-select"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.status.message}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Salary Range
              </label>
              <input
                type="text"
                {...register('salary_range')}
                className="form-input"
                placeholder="e.g., $25-35/hour"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Application URL
              </label>
              <input
                type="url"
                {...register('application_url')}
                className="form-input"
                placeholder="https://company.com/careers/position"
              />
            </div>
          </div>

          <AnimatePresence>
            {(status === 'interview_scheduled' || status === 'interview_completed') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:col-span-2"
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Interview Date
                </label>
                <input
                  type="datetime-local"
                  {...register('interview_date')}
                  className="form-input"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Step 4: Additional Information */}
        <motion.div variants={fieldVariants} className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              stepCompletion[3] 
                ? 'bg-orange-600 text-white' 
                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
            }`}>
              <span className="text-sm font-semibold">4</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Additional Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Contact Person
              </label>
              <input
                type="text"
                {...register('contact_person')}
                className="form-input"
                placeholder="e.g., John Doe"
                onFocus={() => setShowAutocomplete('contact_person')}
                onBlur={() => setTimeout(() => setShowAutocomplete(null), 200)}
              />
              {showAutocomplete === 'contact_person' && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {getAutocompleteSuggestions('contact_person', contactPerson || '').map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                      onClick={() => handleAutocompleteSelect('contact_person', suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Contact Email
              </label>
              <input
                type="email"
                {...register('contact_email')}
                className="form-input"
                placeholder="john.doe@company.com"
                onFocus={() => setShowAutocomplete('contact_email')}
                onBlur={() => setTimeout(() => setShowAutocomplete(null), 200)}
              />
              {showAutocomplete === 'contact_email' && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {getAutocompleteSuggestions('contact_email', contactEmail || '').map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                      onClick={() => handleAutocompleteSelect('contact_email', suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Contact Phone
              </label>
              <input
                type="tel"
                {...register('contact_phone')}
                className="form-input"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Resume Version
              </label>
              <input
                type="text"
                {...register('resume_version')}
                className="form-input"
                placeholder="e.g., v2.1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Cover Letter Version
              </label>
              <input
                type="text"
                {...register('cover_letter_version')}
                className="form-input"
                placeholder="e.g., v1.0"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Position Description
              </label>
              <textarea
                {...register('position_description')}
                rows={3}
                className="form-input resize-none"
                placeholder="Brief description of the position..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Company Description
              </label>
              <textarea
                {...register('company_description')}
                rows={3}
                className="form-input resize-none"
                placeholder="Brief description of the company..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className="form-input resize-none"
                placeholder="Additional notes, follow-up actions, etc..."
              />
            </div>
          </div>
        </motion.div>

        {/* Form Actions */}
        <motion.div 
          variants={fieldVariants}
          className="flex justify-end space-x-4 pt-8 border-t border-pastel-200 dark:border-dark-700"
        >
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-xl hover:bg-pastel-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 card-shadow"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 enhanced-shadow"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Internship' : 'Add Internship')}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default InternshipForm;
