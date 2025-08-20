import React from 'react';
import { motion } from 'framer-motion';
import type { InternshipStats } from '../types/internship';

interface StatsCardsProps {
  stats: InternshipStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const total = stats.total || 0;
  
  // Calculate percentages for progress visualization
  const getPercentage = (value: number) => total > 0 ? (value / total) * 100 : 0;
  
  // Main metrics with progress bars
  const mainMetrics = [
    {
      label: 'Total Applications',
      value: stats.total,
      percentage: 100,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      icon: '📊',
      delay: 0.1,
    },
    {
      label: 'Active Applications',
      value: stats.applied + stats.interview_scheduled + stats.interview_completed,
      percentage: getPercentage(stats.applied + stats.interview_scheduled + stats.interview_completed),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      icon: '📝',
      delay: 0.2,
    },
    {
      label: 'Interview Stage',
      value: stats.interview_scheduled + stats.interview_completed,
      percentage: getPercentage(stats.interview_scheduled + stats.interview_completed),
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      icon: '📅',
      delay: 0.3,
    },
    {
      label: 'Offers Received',
      value: stats.offer_received + stats.offer_accepted + stats.offer_declined,
      percentage: getPercentage(stats.offer_received + stats.offer_accepted + stats.offer_declined),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      icon: '🎉',
      delay: 0.4,
    },
  ];

  // Status breakdown for donut chart
  const statusBreakdown = [
    { label: 'Applied', value: stats.applied, color: '#3B82F6' },
    { label: 'Interview Scheduled', value: stats.interview_scheduled, color: '#F59E0B' },
    { label: 'Interview Completed', value: stats.interview_completed, color: '#8B5CF6' },
    { label: 'Offer Received', value: stats.offer_received, color: '#10B981' },
    { label: 'Offer Accepted', value: stats.offer_accepted, color: '#059669' },
    { label: 'Offer Declined', value: stats.offer_declined, color: '#F97316' },
    { label: 'Rejected', value: stats.rejected, color: '#EF4444' },
    { label: 'Withdrawn', value: stats.withdrawn, color: '#6B7280' },
  ].filter(item => item.value > 0);

  // Calculate donut chart data
  const totalStatus = statusBreakdown.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  const donutSegments = statusBreakdown.map(item => {
    const percentage = totalStatus > 0 ? (item.value / totalStatus) * 100 : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + (percentage * 3.6); // 360 degrees / 100%
    currentAngle = endAngle;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
    };
  });

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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Progress bar component
  const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
      <motion.div
        className={`h-2 rounded-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );

  // Donut chart component
  const DonutChart = () => (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {donutSegments.map((segment, index) => {
          const radius = 40;
          const circumference = 2 * Math.PI * radius;
          const strokeDasharray = circumference;
          const strokeDashoffset = circumference - (segment.percentage / 100) * circumference;
          
          return (
            <motion.circle
              key={index}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="8"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDasharray}
              initial={{ strokeDashoffset: strokeDasharray }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + index * 0.1 }}
              className="transition-all duration-300 hover:stroke-width-10"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{total}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Metrics with Progress Bars */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {mainMetrics.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02,
              y: -2,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.98 }}
            className={`${item.bgColor} rounded-2xl p-6 card-shadow hover:enhanced-shadow transition-all duration-300 border border-white/50 dark:border-dark-600/50`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-sm">{item.icon}</span>
                </div>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  {item.label}
                </p>
                <motion.p 
                  className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 10,
                    delay: item.delay 
                  }}
                >
                  {item.value}
                </motion.p>
              </div>
            </div>
            <ProgressBar percentage={item.percentage} color={item.color} />
          </motion.div>
        ))}
      </motion.div>

      {/* Status Breakdown with Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-effect rounded-2xl p-6 enhanced-shadow"
      >
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Application Status Breakdown
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Donut Chart */}
          <div className="flex justify-center">
            <DonutChart />
          </div>

          {/* Status Legend */}
          <div className="space-y-3">
            {statusBreakdown.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white dark:bg-dark-800 rounded-lg border border-gray-100 dark:border-dark-700"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {item.value}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({totalStatus > 0 ? ((item.value / totalStatus) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsCards;
