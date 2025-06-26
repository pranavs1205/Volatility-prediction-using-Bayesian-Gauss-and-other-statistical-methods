import React from 'react';
import { TrendingUp, TrendingDown, Award, Target } from 'lucide-react';
import { ModelPerformance } from '../../types';

interface PerformanceTableProps {
  performances: ModelPerformance[];
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ performances }) => {
  const getBestPerformance = (metric: keyof ModelPerformance): string => {
    if (metric === 'rmse') {
      return performances.reduce((min, p) => p.rmse < min.rmse ? p : min).modelName;
    }
    if (metric === 'logLikelihood') {
      return performances.reduce((max, p) => p.logLikelihood > max.logLikelihood ? p : max).modelName;
    }
    if (metric === 'aic' || metric === 'bic') {
      return performances.reduce((min, p) => p[metric] < min[metric] ? p : min).modelName;
    }
    if (metric === 'intervalAccuracy95' || metric === 'intervalAccuracy50') {
      return performances.reduce((max, p) => p[metric] > max[metric] ? p : max).modelName;
    }
    return '';
  };

  const formatValue = (value: number, metric: keyof ModelPerformance): string => {
    if (metric === 'rmse') return value.toFixed(4);
    if (metric === 'logLikelihood' || metric === 'aic' || metric === 'bic') return value.toFixed(1);
    if (metric === 'intervalAccuracy95' || metric === 'intervalAccuracy50') return (value * 100).toFixed(1) + '%';
    return value.toString();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span>Model Performance Comparison</span>
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Bayesian model evaluation across multiple metrics and volatility regimes
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                RMSE
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Log-Likelihood
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                AIC
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                BIC
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                95% CI Accuracy
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                50% CI Accuracy
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {performances.map((performance, index) => (
              <tr key={performance.modelName} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {performance.modelName}
                    </div>
                    {getBestPerformance('rmse') === performance.modelName && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400">
                        Best RMSE
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className={`text-sm font-medium ${
                      getBestPerformance('rmse') === performance.modelName 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {formatValue(performance.rmse, 'rmse')}
                    </span>
                    {getBestPerformance('rmse') === performance.modelName && (
                      <TrendingDown className="w-4 h-4 text-success-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className={`text-sm font-medium ${
                      getBestPerformance('logLikelihood') === performance.modelName 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {formatValue(performance.logLikelihood, 'logLikelihood')}
                    </span>
                    {getBestPerformance('logLikelihood') === performance.modelName && (
                      <TrendingUp className="w-4 h-4 text-success-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`text-sm font-medium ${
                    getBestPerformance('aic') === performance.modelName 
                      ? 'text-success-600 dark:text-success-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatValue(performance.aic, 'aic')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`text-sm font-medium ${
                    getBestPerformance('bic') === performance.modelName 
                      ? 'text-success-600 dark:text-success-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatValue(performance.bic, 'bic')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${performance.intervalAccuracy95 * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      getBestPerformance('intervalAccuracy95') === performance.modelName 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {formatValue(performance.intervalAccuracy95, 'intervalAccuracy95')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${performance.intervalAccuracy50 * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      getBestPerformance('intervalAccuracy50') === performance.modelName 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {formatValue(performance.intervalAccuracy50, 'intervalAccuracy50')}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Best Overall:</span>
            <div className="font-semibold text-gray-900 dark:text-white">
              {getBestPerformance('rmse')}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Evaluation Period:</span>
            <div className="font-semibold text-gray-900 dark:text-white">365 days</div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Cross-Validation:</span>
            <div className="font-semibold text-gray-900 dark:text-white">5-Fold</div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
            <div className="font-semibold text-gray-900 dark:text-white">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};