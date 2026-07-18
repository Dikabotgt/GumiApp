/**
 * GumiGenk Journal — Mock Market Data
 * Demo data for market dashboard
 */

export const mockMarketData = {
  forex: [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0892, change: 0.0015, changePercent: 0.14, high: 1.0910, low: 1.0875 },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: 1.2734, change: -0.0022, changePercent: -0.17, high: 1.2760, low: 1.2710 },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: 154.82, change: 0.45, changePercent: 0.29, high: 155.10, low: 154.20 },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', price: 0.6543, change: 0.0008, changePercent: 0.12, high: 0.6560, low: 0.6530 },
    { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', price: 0.8876, change: -0.0012, changePercent: -0.14, high: 0.8895, low: 0.8860 },
    { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', price: 1.3621, change: 0.0018, changePercent: 0.13, high: 1.3640, low: 1.3600 },
    { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', price: 0.6021, change: -0.0005, changePercent: -0.08, high: 0.6035, low: 0.6010 },
    { symbol: 'EUR/GBP', name: 'Euro / British Pound', price: 0.8553, change: 0.0010, changePercent: 0.12, high: 0.8570, low: 0.8540 },
  ],
  metals: [
    { symbol: 'XAU/USD', name: 'Gold', price: 2438.50, change: 12.30, changePercent: 0.51, high: 2445.00, low: 2420.00 },
    { symbol: 'XAG/USD', name: 'Silver', price: 31.24, change: -0.18, changePercent: -0.57, high: 31.50, low: 30.90 },
  ],
  crypto: [
    { symbol: 'BTC/USD', name: 'Bitcoin', price: 67842.50, change: 1245.00, changePercent: 1.87, high: 68200.00, low: 66500.00 },
    { symbol: 'ETH/USD', name: 'Ethereum', price: 3456.80, change: -45.20, changePercent: -1.29, high: 3520.00, low: 3420.00 },
    { symbol: 'SOL/USD', name: 'Solana', price: 178.42, change: 5.63, changePercent: 3.26, high: 182.00, low: 172.50 },
    { symbol: 'XRP/USD', name: 'Ripple', price: 0.6234, change: 0.012, changePercent: 1.96, high: 0.6300, low: 0.6100 },
  ],
  indices: [
    { symbol: 'NAS100', name: 'NASDAQ 100', price: 18542.30, change: 125.40, changePercent: 0.68, high: 18600.00, low: 18400.00 },
    { symbol: 'US30', name: 'Dow Jones 30', price: 39821.50, change: -87.30, changePercent: -0.22, high: 39950.00, low: 39750.00 },
    { symbol: 'SPX500', name: 'S&P 500', price: 5432.10, change: 18.70, changePercent: 0.35, high: 5445.00, low: 5410.00 },
    { symbol: 'DXY', name: 'US Dollar Index', price: 104.28, change: -0.15, changePercent: -0.14, high: 104.50, low: 104.10 },
  ],
};

export const mockNews = [
  {
    id: '1',
    title: 'Fed Signals Potential Rate Cut in September Meeting',
    source: 'Reuters',
    time: '2h ago',
    impact: 'high',
    category: 'monetary-policy',
  },
  {
    id: '2',
    title: 'Gold Hits New All-Time High Amid Safe Haven Demand',
    source: 'Bloomberg',
    time: '4h ago',
    impact: 'high',
    category: 'commodities',
  },
  {
    id: '3',
    title: 'Bitcoin ETF Records Highest Daily Inflows Since Launch',
    source: 'CoinDesk',
    time: '6h ago',
    impact: 'medium',
    category: 'crypto',
  },
  {
    id: '4',
    title: 'European PMI Data Falls Below Expectations',
    source: 'FX Street',
    time: '8h ago',
    impact: 'medium',
    category: 'economic-data',
  },
  {
    id: '5',
    title: 'Crude Oil Steady as OPEC+ Maintains Production Cuts',
    source: 'CNBC',
    time: '12h ago',
    impact: 'low',
    category: 'energy',
  },
];

export const mockCalendarEvents = [
  { time: '08:30', event: 'US Non-Farm Payrolls', impact: 'high', actual: '206K', forecast: '190K', previous: '218K', currency: 'USD' },
  { time: '10:00', event: 'ISM Services PMI', impact: 'high', actual: '-', forecast: '52.5', previous: '53.8', currency: 'USD' },
  { time: '14:00', event: 'FOMC Meeting Minutes', impact: 'high', actual: '-', forecast: '-', previous: '-', currency: 'USD' },
  { time: '15:30', event: 'US Crude Oil Inventories', impact: 'medium', actual: '-', forecast: '-1.2M', previous: '-2.5M', currency: 'USD' },
  { time: '19:00', event: 'RBA Rate Decision', impact: 'high', actual: '-', forecast: '4.35%', previous: '4.35%', currency: 'AUD' },
];
