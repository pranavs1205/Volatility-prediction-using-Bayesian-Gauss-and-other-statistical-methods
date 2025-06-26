import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  description?: string;
  trend?: number[];
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  description,
  trend
}) => {
  const changeColors = {
    positive: 'text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-900/20',
    negative: 'text-error-600 bg-error-50 dark:text-error-400 dark:bg-error-900/20',
    neutral: 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
          </div>
          
          <div className="mb-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
            {change && (
              <span className={`ml-2 text-sm font-medium px-2 py-1 rounded-full ${changeColors[changeType]}`}>
                {change}
              </span>
            )}
          </div>
          
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        
        {trend && (
          <div className="w-16 h-8">
            <svg viewBox="0 0 64 32" className="w-full h-full">
              <polyline
                points={trend.map((val, idx) => `${(idx / (trend.length - 1)) * 64},${32 - (val * 32)}`).join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary-500"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};