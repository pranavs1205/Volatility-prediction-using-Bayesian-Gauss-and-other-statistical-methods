import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { VolatilityRegime } from '../../types';
import { format, parseISO } from 'date-fns';

interface RegimeTimelineProps {
  regimes: VolatilityRegime[];
}

export const RegimeTimeline: React.FC<RegimeTimelineProps> = ({ regimes }) => {
  const getRegimeIcon = (classification: VolatilityRegime['classification']) => {
    switch (classification) {
      case 'low': return <TrendingDown className="w-4 h-4" />;
      case 'medium': return <Activity className="w-4 h-4" />;
      case 'high': return <TrendingUp className="w-4 h-4" />;
      case 'extreme': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRegimeColor = (classification: VolatilityRegime['classification']) => {
    switch (classification) {
      case 'low': return 'bg-success-50 text-success-700 border-success-200 dark:bg-success-900/20 dark:text-success-400 dark:border-success-800';
      case 'medium': return 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800';
      case 'high': return 'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-900/20 dark:text-warning-400 dark:border-warning-800';
      case 'extreme': return 'bg-error-50 text-error-700 border-error-200 dark:bg-error-900/20 dark:text-error-400 dark:border-error-800';
    }
  };

  const getDuration = (startDate: string, endDate: string): number => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Volatility Regime Timeline
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Markov Regime Switching Analysis
        </div>
      </div>

      <div className="space-y-4">
        {regimes.map((regime, index) => (
          <div key={regime.id} className="relative">
            {index !== regimes.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-6 bg-gray-200 dark:bg-gray-700"></div>
            )}
            
            <div className={`p-4 rounded-lg border-2 ${getRegimeColor(regime.classification)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getRegimeIcon(regime.classification)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">{regime.name}</h4>
                    <div className="text-sm opacity-80">
                      {format(parseISO(regime.startDate), 'MMM dd, yyyy')} - {format(parseISO(regime.endDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold mb-1">
                    {(regime.avgVolatility * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs opacity-80">
                    Avg Volatility
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="opacity-70">Duration:</span>
                  <div className="font-semibold">
                    {getDuration(regime.startDate, regime.endDate)} days
                  </div>
                </div>
                <div>
                  <span className="opacity-70">Probability:</span>
                  <div className="font-semibold">
                    {(regime.probability * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="opacity-70">Classification:</span>
                  <div className="font-semibold capitalize">
                    {regime.classification}
                  </div>
                </div>
              </div>
              
              {/* Probability visualization */}
              <div className="mt-3">
                <div className="w-full bg-white/50 dark:bg-gray-800/50 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-current opacity-60" 
                    style={{ width: `${regime.probability * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Regime Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Total Regimes:</span>
            <div className="font-semibold text-gray-900 dark:text-white">{regimes.length}</div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Most Common:</span>
            <div className="font-semibold text-gray-900 dark:text-white capitalize">
              {regimes.reduce((prev, current) => 
                getDuration(current.startDate, current.endDate) > getDuration(prev.startDate, prev.endDate) ? current : prev
              ).classification}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Avg Duration:</span>
            <div className="font-semibold text-gray-900 dark:text-white">
              {Math.round(regimes.reduce((sum, regime) => 
                sum + getDuration(regime.startDate, regime.endDate), 0
              ) / regimes.length)} days
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Current Regime:</span>
            <div className="font-semibold text-gray-900 dark:text-white capitalize">
              {regimes[regimes.length - 1]?.classification || 'Unknown'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};