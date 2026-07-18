/**
 * GumiGenk Journal — Constants
 * App-wide constant values
 */

export const APP_NAME = 'GumiGenk Journal';
export const APP_VERSION = '1.0.0';
export const APP_TAGLINE = 'Trade Smarter, Journal Better';

// Trading sessions
export const SESSIONS = [
  'Asian',
  'London', 
  'New York',
  'Sydney',
  'Overlap (London-NY)',
  'Off-Market',
];

// Trading directions
export const DIRECTIONS = ['BUY', 'SELL'];

// Common strategies
export const STRATEGIES = [
  'ICT - Order Block',
  'ICT - FVG',
  'ICT - MACRO',
  'ICT - Crt',
  'Other',
];

// Emotion tags
export const EMOTIONS = [
  'Confident',
  'Calm',
  'Focused',
  'Anxious',
  'Fearful',
  'Greedy',
  'Frustrated',
  'Revenge',
  'FOMO',
  'Excited',
  'Neutral',
  'Disciplined',
];

// Common trading mistakes
export const MISTAKES = [
  'None',
  'Moved Stop Loss',
  'Oversized Position',
  'No Stop Loss',
  'Early Exit',
  'Late Entry',
  'Revenge Trade',
  'FOMO Entry',
  'Against Trend',
  'Wrong Timeframe',
  'Ignored Rules',
  'Emotional Trade',
  'Overtrading',
  'News Trading',
];

// Confluence factors
export const CONFLUENCES = [
  'Support/Resistance',
  'Moving Average',
  'Fibonacci',
  'Trendline',
  'Volume',
  'Divergence',
  'Pattern',
  'Candlestick',
  'Order Block',
  'Fair Value Gap',
  'Liquidity',
  'Market Structure',
  'Multi-Timeframe',
  'Fundamental',
];

// Instruments organized by category
export const INSTRUMENTS = {
  forex: [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF',
    'AUD/USD', 'NZD/USD', 'USD/CAD', 'EUR/GBP',
    'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'EUR/AUD',
    'GBP/AUD', 'EUR/CAD', 'GBP/CAD', 'CHF/JPY',
  ],
  metals: ['XAU/USD', 'XAG/USD'],
  indices: ['US30', 'NAS100', 'SPX500', 'DAX40', 'FTSE100', 'NI225'],
  crypto: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD', 'ADA/USD', 'DOGE/USD'],
  energy: ['WTI', 'BRENT', 'NGAS'],
};

export const ALL_INSTRUMENTS = Object.values(INSTRUMENTS).flat();

// Sort options
export const SORT_OPTIONS = [
  { label: 'Date (Newest)', value: 'date_desc' },
  { label: 'Date (Oldest)', value: 'date_asc' },
  { label: 'P/L (Highest)', value: 'pl_desc' },
  { label: 'P/L (Lowest)', value: 'pl_asc' },
  { label: 'RR (Highest)', value: 'rr_desc' },
  { label: 'RR (Lowest)', value: 'rr_asc' },
  { label: 'Instrument (A-Z)', value: 'instrument_asc' },
];

// Date filter presets
export const DATE_FILTERS = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 90 Days', value: '90days' },
  { label: 'This Year', value: 'year' },
  { label: 'Custom', value: 'custom' },
];
