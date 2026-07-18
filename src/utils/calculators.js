/**
 * GumiGenk Journal — Trading Calculator Formulas
 * Industry-standard formulas for all 10 calculators
 */

/**
 * Standard pip values for common instruments
 */
const PIP_VALUES = {
  // Forex (Standard lot = 100,000)
  'EUR/USD': { pipSize: 0.0001, contractSize: 100000 },
  'GBP/USD': { pipSize: 0.0001, contractSize: 100000 },
  'USD/JPY': { pipSize: 0.01, contractSize: 100000 },
  'USD/CHF': { pipSize: 0.0001, contractSize: 100000 },
  'AUD/USD': { pipSize: 0.0001, contractSize: 100000 },
  'NZD/USD': { pipSize: 0.0001, contractSize: 100000 },
  'USD/CAD': { pipSize: 0.0001, contractSize: 100000 },
  'EUR/GBP': { pipSize: 0.0001, contractSize: 100000 },
  'EUR/JPY': { pipSize: 0.01, contractSize: 100000 },
  'GBP/JPY': { pipSize: 0.01, contractSize: 100000 },
  
  // Gold & Silver
  'XAU/USD': { pipSize: 0.01, contractSize: 100 },
  'XAG/USD': { pipSize: 0.001, contractSize: 5000 },
  
  // Indices
  'US30': { pipSize: 1, contractSize: 1 },
  'NAS100': { pipSize: 1, contractSize: 1 },
  'SPX500': { pipSize: 0.1, contractSize: 1 },
  
  // Crypto
  'BTC/USD': { pipSize: 0.01, contractSize: 1 },
  'ETH/USD': { pipSize: 0.01, contractSize: 1 },
};

/**
 * Get instrument config or default
 */
export const getInstrumentConfig = (instrument) => {
  return PIP_VALUES[instrument] || { pipSize: 0.0001, contractSize: 100000 };
};

/**
 * 1. Lot Size Calculator
 * lot = (balance × risk%) / (SL_pips × pip_value_per_lot)
 */
export const calculateLotSize = ({ balance, riskPercent, slPips, instrument, exchangeRate = 1 }) => {
  const config = getInstrumentConfig(instrument);
  const riskAmount = balance * (riskPercent / 100);
  const pipValue = (config.pipSize / (exchangeRate || 1)) * config.contractSize;
  const lotSize = riskAmount / (slPips * pipValue);
  return {
    lotSize: Math.round(lotSize * 100) / 100,
    riskAmount: Math.round(riskAmount * 100) / 100,
    pipValue: Math.round(pipValue * 100) / 100,
  };
};

/**
 * 2. Position Size Calculator
 * position = risk_amount / |entry - SL|
 */
export const calculatePositionSize = ({ balance, riskPercent, entryPrice, stopLoss, instrument }) => {
  const config = getInstrumentConfig(instrument);
  const riskAmount = balance * (riskPercent / 100);
  const priceDiff = Math.abs(entryPrice - stopLoss);
  const pipsAtRisk = priceDiff / config.pipSize;
  const pipValue = (config.pipSize / entryPrice) * config.contractSize;
  const positionSize = riskAmount / (pipsAtRisk * pipValue);
  
  return {
    positionSize: Math.round(positionSize * 100) / 100,
    riskAmount: Math.round(riskAmount * 100) / 100,
    pipsAtRisk: Math.round(pipsAtRisk * 10) / 10,
    priceDifference: Math.round(priceDiff * 100000) / 100000,
  };
};

/**
 * 3. Risk Calculator
 * risk = lot × SL_pips × pip_value
 */
export const calculateRisk = ({ lotSize, slPips, instrument, exchangeRate = 1 }) => {
  const config = getInstrumentConfig(instrument);
  const pipValue = (config.pipSize / (exchangeRate || 1)) * config.contractSize * lotSize;
  const riskAmount = slPips * pipValue;
  
  return {
    riskAmount: Math.round(riskAmount * 100) / 100,
    pipValue: Math.round(pipValue * 100) / 100,
  };
};

/**
 * 4. Risk Percentage Calculator
 * risk% = (risk_amount / balance) × 100
 */
export const calculateRiskPercentage = ({ balance, riskAmount }) => {
  const riskPercent = (riskAmount / balance) * 100;
  return {
    riskPercent: Math.round(riskPercent * 100) / 100,
  };
};

/**
 * 5. Pip Value Calculator
 * pip_value = (pipSize / exchangeRate) × contractSize × lotSize
 */
export const calculatePipValue = ({ lotSize, instrument, exchangeRate = 1 }) => {
  const config = getInstrumentConfig(instrument);
  const pipValue = (config.pipSize / (exchangeRate || 1)) * config.contractSize * lotSize;
  
  return {
    pipValue: Math.round(pipValue * 100) / 100,
    pipSize: config.pipSize,
    contractSize: config.contractSize,
  };
};

/**
 * 6. Margin Calculator
 * margin = (lot × contractSize × price) / leverage
 */
export const calculateMargin = ({ lotSize, price, leverage, instrument }) => {
  const config = getInstrumentConfig(instrument);
  const notionalValue = lotSize * config.contractSize * price;
  const margin = notionalValue / leverage;
  
  return {
    margin: Math.round(margin * 100) / 100,
    notionalValue: Math.round(notionalValue * 100) / 100,
    leverageRatio: `1:${leverage}`,
  };
};

/**
 * 7. Profit Calculator
 * profit = (exit - entry) × lot × contractSize × direction
 */
export const calculateProfit = ({ entryPrice, exitPrice, lotSize, direction, instrument }) => {
  const config = getInstrumentConfig(instrument);
  const dirMultiplier = direction === 'BUY' ? 1 : -1;
  const priceDiff = (exitPrice - entryPrice) * dirMultiplier;
  const pips = priceDiff / config.pipSize;
  const profit = priceDiff * lotSize * config.contractSize;
  
  return {
    profit: Math.round(profit * 100) / 100,
    pips: Math.round(pips * 10) / 10,
    isProfit: profit >= 0,
  };
};

/**
 * 8. Drawdown Calculator
 * drawdown% = (peak - trough) / peak × 100
 */
export const calculateDrawdown = ({ peakBalance, currentBalance }) => {
  const drawdownAmount = peakBalance - currentBalance;
  const drawdownPercent = (drawdownAmount / peakBalance) * 100;
  const recoveryPercent = (drawdownAmount / currentBalance) * 100;
  
  return {
    drawdownAmount: Math.round(drawdownAmount * 100) / 100,
    drawdownPercent: Math.round(drawdownPercent * 100) / 100,
    recoveryPercent: Math.round(recoveryPercent * 100) / 100,
    remainingBalance: Math.round(currentBalance * 100) / 100,
  };
};

/**
 * 9. Compound Calculator
 * final = initial × (1 + rate)^periods
 */
export const calculateCompound = ({ initialBalance, ratePercent, periods, contribution = 0 }) => {
  const rate = ratePercent / 100;
  const schedule = [];
  let balance = initialBalance;
  
  for (let i = 1; i <= periods; i++) {
    balance = (balance + contribution) * (1 + rate);
    schedule.push({
      period: i,
      balance: Math.round(balance * 100) / 100,
      totalGain: Math.round((balance - initialBalance - (contribution * i)) * 100) / 100,
    });
  }
  
  const finalBalance = balance;
  const totalGain = finalBalance - initialBalance - (contribution * periods);
  const totalContributions = contribution * periods;
  
  return {
    finalBalance: Math.round(finalBalance * 100) / 100,
    totalGain: Math.round(totalGain * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalReturn: Math.round(((finalBalance - initialBalance) / initialBalance) * 100 * 100) / 100,
    schedule,
  };
};

/**
 * 10. Risk Reward Calculator
 * RR = |TP - entry| / |entry - SL|
 */
export const calculateRiskReward = ({ entryPrice, stopLoss, takeProfit, direction }) => {
  const slDistance = Math.abs(entryPrice - stopLoss);
  const tpDistance = Math.abs(takeProfit - entryPrice);
  const rrRatio = slDistance > 0 ? tpDistance / slDistance : 0;
  
  // Required win rate for break even at this RR
  const breakEvenWinRate = 1 / (1 + rrRatio) * 100;
  
  return {
    rrRatio: Math.round(rrRatio * 100) / 100,
    rrString: `1:${(Math.round(rrRatio * 100) / 100).toFixed(2)}`,
    slDistance: Math.round(slDistance * 100000) / 100000,
    tpDistance: Math.round(tpDistance * 100000) / 100000,
    breakEvenWinRate: Math.round(breakEvenWinRate * 100) / 100,
  };
};

export const INSTRUMENT_LIST = Object.keys(PIP_VALUES);
