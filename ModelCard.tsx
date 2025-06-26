import React from 'react';
import { Play, Pause, Settings, TrendingUp, Clock } from 'lucide-react';
import { BayesianModel } from '../../types';

interface ModelCardProps {
  model: BayesianModel;
  onToggleActive: (modelId: string) => void;
  onConfigure: (modelId: string) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  onToggleActive,
  onConfigure
}) => {
  const modelTypeColors = {
    ARCH: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    GARCH: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
    Kalman: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
    GP: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
    RegimeSwitching: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl p-6 border transition-all duration-200 ${
      model.isActive 
        ? 'border-primary-200 dark:border-primary-800 shadow-md' 
        : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {model.name}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${modelTypeColors[model.type]}`}>
              {model.type}
            </span>
            {model.isActive && (
              <div className="flex items-center space-x-1 text-success-600 dark:text-success-400">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Active</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {model.description}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Model Parameters</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(model.parameters).map(([key, value]) => (
            <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {typeof value === 'number' ? value.toFixed(6) : value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>Updated: {new Date(model.lastUpdated).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4" />
          <span>Bayesian Inference</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => onToggleActive(model.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            model.isActive
              ? 'bg-error-50 text-error-700 hover:bg-error-100 dark:bg-error-900/20 dark:text-error-400 dark:hover:bg-error-900/30'
              : 'bg-success-50 text-success-700 hover:bg-success-100 dark:bg-success-900/20 dark:text-success-400 dark:hover:bg-success-900/30'
          }`}
        >
          {model.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{model.isActive ? 'Deactivate' : 'Activate'}</span>
        </button>
        
        <button
          onClick={() => onConfigure(model.id)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Settings className="w-4 h-4" />
          <span>Configure</span>
        </button>
      </div>
    </div>
  );
};