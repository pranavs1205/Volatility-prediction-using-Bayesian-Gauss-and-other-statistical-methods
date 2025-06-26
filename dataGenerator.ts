import { addDays, format, subDays } from 'date-fns';
import { PriceData, OnChainMetrics, VolatilityForecast, ModelPerformance, BayesianModel, VolatilityRegime } from '../types';

// Generate realistic ETH price data with volatility clustering
export const generatePriceData = (days: number = 365): PriceData[] => {
  const data: PriceData[] = [];
  const startDate = subDays(new Date(), days);
  let price = 2500; // Starting ETH price
  let volatility = 0.03; // Starting volatility
  
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    
    // Volatility clustering using GARCH-like process
    const volatilityShock = (Math.random() - 0.5) * 0.01;
    volatility = Math.max(0.01, 0.95 * volatility + 0.05 * 0.03 + volatilityShock);
    
    // Price returns with regime switching
    const regimeProb = Math.sin(i / 50) * 0.3 + 0.7; // Cyclical regime changes
    const baseReturn = regimeProb > 0.6 ? 0.001 : -0.0005; // Bull vs bear trend
    const returns = baseReturn + (Math.random() - 0.5) * volatility;
    
    price = price * (1 + returns);
    const volume = 50000 + Math.random() * 200000; // Random volume
    const marketCap = price * 120000000; // Approximate ETH supply
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      price: Math.round(price * 100) / 100,
      volume: Math.round(volume),
      marketCap: Math.round(marketCap),
      returns: Math.round(returns * 10000) / 10000,
      volatility: Math.round(volatility * 10000) / 10000,
    });
  }
  
  return data;
};

// Generate on-chain metrics correlated with price activity
export const generateOnChainMetrics = (priceData: PriceData[]): OnChainMetrics[] => {
  return priceData.map((price, index) => {
    const baseGas = 15000000;
    const gasCorrelation = Math.abs(price.returns) * 500000000; // Higher volatility = more gas usage
    const gasUsed = baseGas + gasCorrelation + (Math.random() - 0.5) * 5000000;
    
    const baseAddresses = 400000;
    const addressCorrelation = price.volume / 1000; // Volume affects active addresses
    const activeAddresses = baseAddresses + addressCorrelation + Math.random() * 100000;
    
    const baseTxCount = 1000000;
    const txCorrelation = price.volume / 200;
    const transactionCount = baseTxCount + txCorrelation + Math.random() * 200000;
    
    return {
      date: price.date,
      gasUsed: Math.round(gasUsed),
      activeAddresses: Math.round(activeAddresses),
      transactionCount: Math.round(transactionCount),
      networkValue: Math.round(price.marketCap * 0.8),
      hashRate: Math.round(200 + Math.random() * 50), // TH/s
    };
  });
};

// Generate Bayesian volatility forecasts with uncertainty quantification
export const generateVolatilityForecasts = (
  priceData: PriceData[],
  forecastDays: number = 30
): VolatilityForecast[] => {
  const forecasts: VolatilityForecast[] = [];
  const lastDate = new Date(priceData[priceData.length - 1].date);
  const recentVolatility = priceData.slice(-30).map(d => d.volatility);
  const avgVolatility = recentVolatility.reduce((a, b) => a + b, 0) / recentVolatility.length;
  
  for (let i = 1; i <= forecastDays; i++) {
    const forecastDate = addDays(lastDate, i);
    
    // Bayesian forecast with mean reversion and uncertainty increasing over time
    const timeFactor = Math.sqrt(i / forecastDays); // Uncertainty increases with forecast horizon
    const meanReversion = 0.95; // Strong mean reversion in volatility
    const longTermMean = 0.025;
    
    const predicted = avgVolatility * Math.pow(meanReversion, i) + longTermMean * (1 - Math.pow(meanReversion, i));
    const uncertainty = 0.005 * timeFactor + 0.002; // Base uncertainty + time-varying component
    
    forecasts.push({
      date: format(forecastDate, 'yyyy-MM-dd'),
      predicted: Math.round(predicted * 10000) / 10000,
      lower95: Math.round((predicted - 1.96 * uncertainty) * 10000) / 10000,
      upper95: Math.round((predicted + 1.96 * uncertainty) * 10000) / 10000,
      lower50: Math.round((predicted - 0.67 * uncertainty) * 10000) / 10000,
      upper50: Math.round((predicted + 0.67 * uncertainty) * 10000) / 10000,
    });
  }
  
  return forecasts;
};

// Generate model performance metrics
export const generateModelPerformance = (): ModelPerformance[] => {
  return [
    {
      modelName: 'Bayesian GARCH(1,1)',
      rmse: 0.0087,
      logLikelihood: 2847.3,
      aic: -5686.6,
      bic: -5671.2,
      intervalAccuracy95: 0.943,
      intervalAccuracy50: 0.487,
    },
    {
      modelName: 'Kalman Filter + ARCH',
      rmse: 0.0092,
      logLikelihood: 2831.7,
      aic: -5655.4,
      bic: -5640.1,
      intervalAccuracy95: 0.931,
      intervalAccuracy50: 0.502,
    },
    {
      modelName: 'Gaussian Process',
      rmse: 0.0095,
      logLikelihood: 2823.1,
      aic: -5638.2,
      bic: -5615.8,
      intervalAccuracy95: 0.925,
      intervalAccuracy50: 0.518,
    },
    {
      modelName: 'Regime Switching',
      rmse: 0.0089,
      logLikelihood: 2841.9,
      aic: -5673.8,
      bic: -5651.4,
      intervalAccuracy95: 0.937,
      intervalAccuracy50: 0.493,
    },
  ];
};

// Generate available Bayesian models
export const generateBayesianModels = (): BayesianModel[] => {
  return [
    {
      id: 'garch',
      name: 'Bayesian GARCH(1,1)',
      type: 'GARCH',
      description: 'Generalized Autoregressive Conditional Heteroskedasticity with Bayesian inference',
      parameters: { alpha: 0.085, beta: 0.891, omega: 0.000023 },
      isActive: true,
      lastUpdated: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'kalman',
      name: 'Kalman Filter + ARCH',
      type: 'Kalman',
      description: 'State-space model with time-varying volatility using Kalman filtering',
      parameters: { processNoise: 0.001, observationNoise: 0.025, initialState: 0.03 },
      isActive: true,
      lastUpdated: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'gp',
      name: 'Gaussian Process',
      type: 'GP',
      description: 'Non-parametric Bayesian approach with RBF kernel for volatility modeling',
      parameters: { lengthScale: 12.5, outputScale: 0.008, noiseLevel: 0.002 },
      isActive: false,
      lastUpdated: format(subDays(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'regime',
      name: 'Markov Regime Switching',
      type: 'RegimeSwitching',
      description: 'Two-state Markov model capturing volatility regime changes',
      parameters: { lowVolRegime: 0.018, highVolRegime: 0.045, transitionProb: 0.95 },
      isActive: true,
      lastUpdated: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
    },
  ];
};

// Generate volatility regimes
export const generateVolatilityRegimes = (priceData: PriceData[]): VolatilityRegime[] => {
  const regimes: VolatilityRegime[] = [];
  let currentRegime: VolatilityRegime | null = null;
  const threshold = 0.03; // Volatility threshold for regime classification
  
  priceData.forEach((data, index) => {
    const classification = data.volatility < 0.02 ? 'low' : 
                         data.volatility < threshold ? 'medium' : 
                         data.volatility < 0.05 ? 'high' : 'extreme';
    
    if (!currentRegime || currentRegime.classification !== classification) {
      if (currentRegime) {
        currentRegime.endDate = priceData[index - 1].date;
        regimes.push(currentRegime);
      }
      
      currentRegime = {
        id: `regime-${regimes.length + 1}`,
        name: `${classification.charAt(0).toUpperCase() + classification.slice(1)} Volatility Period`,
        startDate: data.date,
        endDate: data.date,
        avgVolatility: data.volatility,
        classification: classification as 'low' | 'medium' | 'high' | 'extreme',
        probability: Math.random() * 0.3 + 0.7, // Random probability between 0.7-1.0
      };
    } else {
      // Update current regime
      const regimeData = priceData.slice(
        priceData.findIndex(d => d.date === currentRegime!.startDate),
        index + 1
      );
      currentRegime.avgVolatility = regimeData.reduce((sum, d) => sum + d.volatility, 0) / regimeData.length;
      currentRegime.endDate = data.date;
    }
  });
  
  if (currentRegime) {
    regimes.push(currentRegime);
  }
  
  return regimes;
};