export interface PriceData {
  date: string;
  price: number;
  volume: number;
  marketCap: number;
  returns: number;
  volatility: number;
}

export interface OnChainMetrics {
  date: string;
  gasUsed: number;
  activeAddresses: number;
  transactionCount: number;
  networkValue: number;
  hashRate: number;
}

export interface VolatilityForecast {
  date: string;
  predicted: number;
  lower95: number;
  upper95: number;
  lower50: number;
  upper50: number;
  actual?: number;
}

export interface ModelPerformance {
  modelName: string;
  rmse: number;
  logLikelihood: number;
  aic: number;
  bic: number;
  intervalAccuracy95: number;
  intervalAccuracy50: number;
}

export interface BayesianModel {
  id: string;
  name: string;
  type: 'ARCH' | 'GARCH' | 'Kalman' | 'GP' | 'RegimeSwitching';
  description: string;
  parameters: Record<string, number>;
  isActive: boolean;
  lastUpdated: string;
}

export interface VolatilityRegime {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  avgVolatility: number;
  classification: 'low' | 'medium' | 'high' | 'extreme';
  probability: number;
}

export interface UncertaintyMetrics {
  posteriorMean: number;
  posteriorStd: number;
  credibleInterval95: [number, number];
  credibleInterval50: [number, number];
  effectiveSampleSize: number;
  rHat: number;
}