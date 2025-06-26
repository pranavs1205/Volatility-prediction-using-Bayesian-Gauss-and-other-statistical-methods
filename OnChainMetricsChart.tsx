import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar
} from 'recharts';
import { OnChainMetrics, PriceData } from '../../types';

interface OnChainMetricsChartProps {
  onChainData: OnChainMetrics[];
  priceData: PriceData[];
  selectedMetrics: string[];
}

export const OnChainMetricsChart: React.FC<OnChainMetricsChartProps> = ({
  onChainData,
  priceData,
  selectedMetrics
}) => {
  // Combine data for correlation analysis
  const combinedData = onChainData.map((onChain, index) => {
    const pricePoint = priceData.find(p => p.date === onChain.date);
    return {
      date: onChain.date,
      gasUsed: onChain.gasUsed / 1000000, // Convert to millions
      activeAddresses: onChain.activeAddresses / 1000, // Convert to thousands
      transactionCount: onChain.transactionCount / 1000, // Convert to thousands
      networkValue: onChain.networkValue / 1000000000, // Convert to billions
      hashRate: onChain.hashRate,
      price: pricePoint?.price || 0,
      volatility: pricePoint ? pricePoint.volatility * 100 : 0, // Convert to percentage
    };
  });

  const metricConfig = {
    gasUsed: { color: '#f59e0b', name: 'Gas Used (M)', unit: 'M' },
    activeAddresses: { color: '#10b981', name: 'Active Addresses (K)', unit: 'K' },
    transactionCount: { color: '#3b82f6', name: 'Transactions (K)', unit: 'K' },
    networkValue: { color: '#8b5cf6', name: 'Network Value (B)', unit: 'B' },
    hashRate: { color: '#ef4444', name: 'Hash Rate (TH/s)', unit: 'TH/s' },
    volatility: { color: '#f97316', name: 'Volatility (%)', unit: '%' },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 dark:text-gray-300">{entry.name}:</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {entry.value.toFixed(2)} {metricConfig[entry.dataKey as keyof typeof metricConfig]?.unit}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          On-Chain Metrics & Volatility Correlation
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          {selectedMetrics.map(metric => (
            <div key={metric} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: metricConfig[metric as keyof typeof metricConfig]?.color }}
              />
              <span className="text-gray-600 dark:text-gray-300">
                {metricConfig[metric as keyof typeof metricConfig]?.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={combinedData.slice(-90)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            orientation="left"
          />
          <YAxis 
            yAxisId="right"
            tick={{ fontSize: 12 }}
            orientation="right"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {selectedMetrics.includes('volatility') && (
            <Bar
              yAxisId="right"
              dataKey="volatility"
              fill={metricConfig.volatility.color}
              fillOpacity={0.3}
              name={metricConfig.volatility.name}
            />
          )}
          
          {selectedMetrics.filter(m => m !== 'volatility').map(metric => (
            <Line
              key={metric}
              yAxisId="left"
              type="monotone"
              dataKey={metric}
              stroke={metricConfig[metric as keyof typeof metricConfig]?.color}
              strokeWidth={2}
              dot={false}
              name={metricConfig[metric as keyof typeof metricConfig]?.name}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        {selectedMetrics.map(metric => {
          const latestValue = combinedData[combinedData.length - 1]?.[metric as keyof typeof combinedData];
          const previousValue = combinedData[combinedData.length - 2]?.[metric as keyof typeof combinedData];
          const change = latestValue && previousValue ? 
            ((Number(latestValue) - Number(previousValue)) / Number(previousValue) * 100) : 0;
          
          return (
            <div key={metric} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: metricConfig[metric as keyof typeof metricConfig]?.color }}
                />
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  {metricConfig[metric as keyof typeof metricConfig]?.name}
                </span>
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {Number(latestValue).toFixed(2)} {metricConfig[metric as keyof typeof metricConfig]?.unit}
              </div>
              <div className={`text-xs ${change >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                {change >= 0 ? '+' : ''}{change.toFixed(1)}% 24h
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};