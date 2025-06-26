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
  Area,
  ComposedChart,
  ReferenceLine
} from 'recharts';
import { VolatilityForecast, PriceData } from '../../types';

interface VolatilityForecastChartProps {
  historicalData: PriceData[];
  forecasts: VolatilityForecast[];
  showConfidenceIntervals?: boolean;
}

export const VolatilityForecastChart: React.FC<VolatilityForecastChartProps> = ({
  historicalData,
  forecasts,
  showConfidenceIntervals = true
}) => {
  // Combine historical and forecast data
  const combinedData = [
    ...historicalData.slice(-60).map(d => ({
      date: d.date,
      historical: d.volatility,
      predicted: null,
      lower95: null,
      upper95: null,
      lower50: null,
      upper50: null,
    })),
    ...forecasts.map(f => ({
      date: f.date,
      historical: null,
      predicted: f.predicted,
      lower95: f.lower95,
      upper95: f.upper95,
      lower50: f.lower50,
      upper50: f.upper50,
    }))
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-300">
                {entry.name}: {(entry.value * 100).toFixed(2)}%
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
          Volatility Forecasting with Bayesian Uncertainty
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Historical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Forecast</span>
          </div>
          {showConfidenceIntervals && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-200 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">95% CI</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-300 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">50% CI</span>
              </div>
            </>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Confidence intervals */}
          {showConfidenceIntervals && (
            <>
              <Area
                type="monotone"
                dataKey="upper95"
                stroke="none"
                fill="#fecaca"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="lower95"
                stroke="none"
                fill="white"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="upper50"
                stroke="none"
                fill="#fca5a5"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="lower50"
                stroke="none"
                fill="white"
                fillOpacity={1}
              />
            </>
          )}
          
          {/* Main lines */}
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            connectNulls={false}
          />
          
          {/* Reference line at current date */}
          <ReferenceLine 
            x={historicalData[historicalData.length - 1]?.date} 
            stroke="#6b7280" 
            strokeDasharray="2 2"
            label={{ value: "Forecast Start", position: "topLeft" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Current Volatility:</span>
            <div className="font-semibold text-gray-900 dark:text-white">
              {(historicalData[historicalData.length - 1]?.volatility * 100).toFixed(2)}%
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">30-Day Forecast:</span>
            <div className="font-semibold text-gray-900 dark:text-white">
              {(forecasts[forecasts.length - 1]?.predicted * 100).toFixed(2)}%
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Forecast Range:</span>
            <div className="font-semibold text-gray-900 dark:text-white">
              {(forecasts[forecasts.length - 1]?.lower95 * 100).toFixed(2)}% - {(forecasts[forecasts.length - 1]?.upper95 * 100).toFixed(2)}%
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Confidence:</span>
            <div className="font-semibold text-success-600 dark:text-success-400">95%</div>
          </div>
        </div>
      </div>
    </div>
  );
};