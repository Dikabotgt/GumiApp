/**
 * GumiGenk Journal — Instrument Definitions
 */

export const instrumentCategories = {
  forex: {
    label: 'Forex',
    icon: 'swap-horizontal',
    instruments: [
      { symbol: 'EUR/USD', name: 'Euro / US Dollar', pipSize: 0.0001, contractSize: 100000 },
      { symbol: 'GBP/USD', name: 'British Pound / US Dollar', pipSize: 0.0001, contractSize: 100000 },
      { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', pipSize: 0.01, contractSize: 100000 },
      { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', pipSize: 0.0001, contractSize: 100000 },
      { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', pipSize: 0.0001, contractSize: 100000 },
      { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', pipSize: 0.0001, contractSize: 100000 },
      { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', pipSize: 0.0001, contractSize: 100000 },
      { symbol: 'EUR/GBP', name: 'Euro / British Pound', pipSize: 0.0001, contractSize: 100000 },
      { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', pipSize: 0.01, contractSize: 100000 },
      { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', pipSize: 0.01, contractSize: 100000 },
    ],
  },
  metals: {
    label: 'Metals',
    icon: 'diamond',
    instruments: [
      { symbol: 'XAU/USD', name: 'Gold', pipSize: 0.01, contractSize: 100 },
      { symbol: 'XAG/USD', name: 'Silver', pipSize: 0.001, contractSize: 5000 },
    ],
  },
  indices: {
    label: 'Indices',
    icon: 'bar-chart',
    instruments: [
      { symbol: 'US30', name: 'Dow Jones 30', pipSize: 1, contractSize: 1 },
      { symbol: 'NAS100', name: 'NASDAQ 100', pipSize: 1, contractSize: 1 },
      { symbol: 'SPX500', name: 'S&P 500', pipSize: 0.1, contractSize: 1 },
      { symbol: 'DXY', name: 'US Dollar Index', pipSize: 0.01, contractSize: 1000 },
    ],
  },
  crypto: {
    label: 'Crypto',
    icon: 'logo-bitcoin',
    instruments: [
      { symbol: 'BTC/USD', name: 'Bitcoin', pipSize: 0.01, contractSize: 1 },
      { symbol: 'ETH/USD', name: 'Ethereum', pipSize: 0.01, contractSize: 1 },
      { symbol: 'SOL/USD', name: 'Solana', pipSize: 0.01, contractSize: 1 },
      { symbol: 'XRP/USD', name: 'Ripple', pipSize: 0.0001, contractSize: 1 },
    ],
  },
  energy: {
    label: 'Energy',
    icon: 'flame',
    instruments: [
      { symbol: 'WTI', name: 'Crude Oil WTI', pipSize: 0.01, contractSize: 1000 },
      { symbol: 'BRENT', name: 'Brent Crude', pipSize: 0.01, contractSize: 1000 },
      { symbol: 'NGAS', name: 'Natural Gas', pipSize: 0.001, contractSize: 10000 },
    ],
  },
};

export const getAllInstruments = () => {
  return Object.values(instrumentCategories).flatMap(cat => 
    cat.instruments.map(inst => inst.symbol)
  );
};

export const getInstrumentBySymbol = (symbol) => {
  for (const category of Object.values(instrumentCategories)) {
    const found = category.instruments.find(inst => inst.symbol === symbol);
    if (found) return found;
  }
  return null;
};
