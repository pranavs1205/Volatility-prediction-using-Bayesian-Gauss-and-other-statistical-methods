import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Settings, 
  Database, 
  Activity,
  Brain,
  Target,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'forecasting', label: 'Volatility Forecasting', icon: TrendingUp },
  { id: 'models', label: 'Bayesian Models', icon: Brain },
  { id: 'onchain', label: 'On-Chain Signals', icon: Activity },
  { id: 'regimes', label: 'Volatility Regimes', icon: Target },
  { id: 'performance', label: 'Model Performance', icon: Zap },
  { id: 'data', label: 'Data Sources', icon: Database },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-8 p-4 bg-gradient-to-r from-ethereum-500 to-primary-600 rounded-lg text-white">
        <h3 className="font-semibold mb-2">Model Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Active Models:</span>
            <span>3/4</span>
          </div>
          <div className="flex justify-between">
            <span>Last Update:</span>
            <span>2 min ago</span>
          </div>
          <div className="flex justify-between">
            <span>Forecast Horizon:</span>
            <span>30 days</span>
          </div>
        </div>
      </div>
    </aside>
  );
};