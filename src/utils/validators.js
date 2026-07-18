/**
 * GumiGenk Journal — Form Validators
 */

export const validateTrade = (trade) => {
  const errors = {};

  if (!trade.instrument || trade.instrument.trim().length === 0) {
    errors.instrument = 'Instrument is required';
  }

  if (!trade.direction || !['BUY', 'SELL'].includes(trade.direction)) {
    errors.direction = 'Direction must be BUY or SELL';
  }

  if (trade.entry && isNaN(parseFloat(trade.entry))) {
    errors.entry = 'Entry must be a valid number';
  }

  if (trade.exit && isNaN(parseFloat(trade.exit))) {
    errors.exit = 'Exit must be a valid number';
  }

  if (trade.stopLoss && isNaN(parseFloat(trade.stopLoss))) {
    errors.stopLoss = 'Stop Loss must be a valid number';
  }

  if (trade.takeProfit && isNaN(parseFloat(trade.takeProfit))) {
    errors.takeProfit = 'Take Profit must be a valid number';
  }

  if (trade.lot && (isNaN(parseFloat(trade.lot)) || parseFloat(trade.lot) < 0)) {
    errors.lot = 'Lot size must be a positive number';
  }

  if (trade.riskPercent && (isNaN(parseFloat(trade.riskPercent)) || parseFloat(trade.riskPercent) > 100)) {
    errors.riskPercent = 'Risk % must be between 0 and 100';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCalculatorInput = (value, fieldName) => {
  if (value === '' || value === null || value === undefined) {
    return `${fieldName} is required`;
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  if (num < 0) {
    return `${fieldName} must be positive`;
  }
  return null;
};
