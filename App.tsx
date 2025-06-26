import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { MetricsCard } from './components/Dashboard/MetricsCard';
import { VolatilityForecastChart } from './components/Charts/VolatilityForecastChart';
import { OnChainMetricsChart } from './components/Charts/OnChainMetricsChart';
import { ModelCard } from './components/Models/ModelCard';
import { PerformanceTable } from './components/Performance/PerformanceTable';
import { RegimeTimeline } from './components/Regimes/RegimeTimeline';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Users, 
  Zap,
  Brain,
  Target
} from 'lucide-react';
import {
  generatePriceData,
  generateOnChainMetrics,
  generateVolatilityForecasts,
  generateModelPerformance,
  generateBayesianModels,
  generateVolatilityRegimes
} from './utils/dataGenerator';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOnChainMetrics, setSelectedOnChainMetrics] = useState(['gasUsed', 'activeAddresses', 'volatility']);

  // Data states
  const [priceData] = useState(() => generatePriceData(365));
  const [onChainData] = useState(() => generateOnChainMetrics(generatePriceData(365)));
  const [forecasts] = useState(() => generateVolatilityForecasts(generatePriceData(365), 30));
  const [modelPerformances] = useState(() => generateModelPerformance());
  const [bayesianModels, setBayesianModels] = useState(() => generateBayesianModels());
  const [volatilityRegimes] = useState(() => generateVolatilityRegimes(generatePriceData(365)));

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleModelToggle = (modelId: string) => {
    setBayesianModels(models =>
      models.map(model =>
        model.id === modelId ? { ...model, isActive: !model.isActive } : model
      )
    );
  };

  const handleModelConfigure = (modelId: string) => {
    console.log('Configure model:', modelId);
    // Implementation for model configuration modal would go here
  };

  const currentPrice = priceData[priceData.length - 1]?.price || 0;
  const currentVolatility = priceData[priceData.length - 1]?.volatility || 0;
  const priceChange = priceData.length > 1 ? 
    ((currentPrice - priceData[priceData.length - 2].price) / priceData[priceData.length - 2].price * 100) : 0;
  const volatilityChange = priceData.length > 1 ? 
    ((currentVolatility - priceData[priceData.length - 2].volatility) / priceData[priceData.length - 2].volatility * 100) : 0;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="ETH Price"
                value={`$${currentPrice.toFixed(2)}`}
                change={`${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`}
                changeType={priceChange >= 0 ? 'positive' : 'negative'}
                icon={DollarSign}
                description="Current Ethereum price"
              />
              <MetricsCard
                title="Current Volatility"
                value={`${(currentVolatility * 100).toFixed(2)}%`}
                change={`${volatilityChange >= 0 ? '+' : ''}${volatilityChange.toFixed(1)}%`}
                changeType={volatilityChange >= 0 ? 'negative' : 'positive'}
                icon={Activity}
                description="Daily realized volatility"
              />
              <MetricsCard
                title="Active Models"
                value={bayesianModels.filter(m => m.isActive).length}
                icon={Brain}
                description="Bayesian models running"
              />
              <MetricsCard
                title="Forecast Accuracy"
                value="94.3%"
                change="+2.1%"
                changeType="positive"
                icon={Target}
                description="95% CI accuracy rate"
              />
            </div>

            {/* Main Chart */}
            <VolatilityForecastChart
              historicalData={priceData}
              forecasts={forecasts}
              showConfidenceIntervals={true}
            />

            {/* Model Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Model Performance Summary
                </h3>
                <div className="space-y-3">
                  {modelPerformances.slice(0, 3).map((perf, index) => (
                    <div key={perf.modelName} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{perf.modelName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">RMSE: {perf.rmse.toFixed(4)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-success-600 dark:text-success-400">
                          {(perf.intervalAccuracy95 * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">95% CI Accuracy</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Current Volatility Regime
                </h3>
                {volatilityRegimes.length > 0 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-primary-900 dark:text-primary-100">
                          {volatilityRegimes[volatilityRegimes.length - 1].name}
                        </h4>
                        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                          {(volatilityRegimes[volatilityRegimes.length - 1].probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-primary-700 dark:text-primary-300">
                        Average Volatility: {(volatilityRegimes[volatilityRegimes.length - 1].avgVolatility * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'forecasting':
        return (
          <div className="space-y-6">
            <VolatilityForecastChart
              historicalData={priceData}
              forecasts={forecasts}
              showConfidenceIntervals={true}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Forecast Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mean Reversion Speed</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">0.85</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Long-term Mean</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">2.5%</div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Bayesian Insights</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        The current model ensemble suggests a mean-reverting volatility process with strong clustering effects. 
                        Uncertainty bands widen over the forecast horizon, reflecting epistemic uncertainty in model parameters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Forecast Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Horizon:</span>
                      <span className="font-medium text-gray-900 dark:text-white">30 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Update Frequency:</span>
                      <span className="font-medium text-gray-900 dark:text-white">Daily</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">MCMC Samples:</span>
                      <span className="font-medium text-gray-900 dark:text-white">10,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Convergence:</span>
                      <span className="font-medium text-success-600 dark:text-success-400">✓ R-hat &lt; 1.1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'models':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bayesianModels.map(model => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onToggleActive={handleModelToggle}
                  onConfigure={handleModelConfigure}
                />
              ))}
            </div>
          </div>
        );

      case 'onchain':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  On-Chain Metrics Selection
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['gasUsed', 'activeAddresses', 'transactionCount', 'networkValue', 'hashRate', 'volatility'].map(metric => (
                    <button
                      key={metric}
                      onClick={() => {
                        if (selectedOnChainMetrics.includes(metric)) {
                          setSelectedOnChainMetrics(prev => prev.filter(m => m !== metric));
                        } else {
                          setSelectedOnChainMetrics(prev => [...prev, metric]);
                        }
                      }}
                      className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                        selectedOnChainMetrics.includes(metric)
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <OnChainMetricsChart
              onChainData={onChainData}
              priceData={priceData}
              selectedMetrics={selectedOnChainMetrics}
            />
          </div>
        );

      case 'regimes':
        return (
          <div className="space-y-6">
            <RegimeTimeline regimes={volatilityRegimes} />
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <PerformanceTable performances={modelPerformances} />
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Price Data Sources
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Binance API</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Real-time OHLCV data</div>
                    </div>
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">CoinGecko</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Market cap & volume</div>
                    </div>
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  On-Chain Data Sources
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Glassnode</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Network metrics & addresses</div>
                    </div>
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Etherscan</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Gas usage & transactions</div>
                    </div>
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Data Quality & Processing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Coverage</h4>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {priceData.length} days
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Historical data points
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Update Frequency</h4>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    5 min
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Real-time updates
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Quality</h4>
                  <div className="text-2xl font-bold text-success-600 dark:text-success-400 mb-1">
                    99.8%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Completeness score
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Header isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;