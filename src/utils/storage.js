/**
 * GumiGenk Journal — Storage Utilities
 * AsyncStorage CRUD operations for trades and app data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TRADES_KEY = '@gumiGenk_trades';
const BACKUP_KEY = '@gumiGenk_backup';

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Load all trades from storage
 */
export const loadTrades = async () => {
  try {
    const data = await AsyncStorage.getItem(TRADES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load trades:', error);
    return [];
  }
};

/**
 * Save trades to storage
 */
export const saveTrades = async (trades) => {
  try {
    await AsyncStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  } catch (error) {
    console.error('Failed to save trades:', error);
  }
};

/**
 * Create backup of all data
 */
export const createBackup = async () => {
  try {
    const trades = await loadTrades();
    const settings = await AsyncStorage.getItem('@gumiGenk_settings');
    const backup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      trades,
      settings: settings ? JSON.parse(settings) : {},
    };
    return JSON.stringify(backup, null, 2);
  } catch (error) {
    console.error('Failed to create backup:', error);
    return null;
  }
};

/**
 * Restore from backup
 */
export const restoreBackup = async (backupJson) => {
  try {
    const backup = JSON.parse(backupJson);
    if (backup.trades) {
      await saveTrades(backup.trades);
    }
    if (backup.settings) {
      await AsyncStorage.setItem('@gumiGenk_settings', JSON.stringify(backup.settings));
    }
    return true;
  } catch (error) {
    console.error('Failed to restore backup:', error);
    return false;
  }
};

/**
 * Clear all app data
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      TRADES_KEY,
      '@gumiGenk_settings',
      '@gumiGenk_theme',
    ]);
    return true;
  } catch (error) {
    console.error('Failed to clear data:', error);
    return false;
  }
};

/**
 * Parse CSV string to trades array
 */
export const parseCSV = (csvString) => {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const trades = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const trade = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      // Map common CSV headers to our trade fields
      switch (header) {
        case 'date': trade.date = value; break;
        case 'time': trade.time = value; break;
        case 'instrument':
        case 'symbol':
        case 'pair': trade.instrument = value; break;
        case 'direction':
        case 'type':
        case 'side': trade.direction = value.toUpperCase(); break;
        case 'entry':
        case 'entry_price':
        case 'open': trade.entry = parseFloat(value) || 0; break;
        case 'exit':
        case 'exit_price':
        case 'close': trade.exit = parseFloat(value) || 0; break;
        case 'sl':
        case 'stop_loss':
        case 'stoploss': trade.stopLoss = parseFloat(value) || 0; break;
        case 'tp':
        case 'take_profit':
        case 'takeprofit': trade.takeProfit = parseFloat(value) || 0; break;
        case 'lot':
        case 'lots':
        case 'volume': trade.lot = parseFloat(value) || 0; break;
        case 'risk':
        case 'risk_percent':
        case 'risk%': trade.riskPercent = parseFloat(value) || 0; break;
        case 'pl':
        case 'pnl':
        case 'profit':
        case 'profit_loss': trade.profitLoss = parseFloat(value) || 0; break;
        case 'rr':
        case 'risk_reward':
        case 'rr_ratio': trade.rrRatio = parseFloat(value) || 0; break;
        case 'strategy': trade.strategy = value; break;
        case 'session': trade.session = value; break;
        case 'notes': trade.notes = value; break;
        case 'tags': trade.tags = value.split(';').filter(Boolean); break;
        default: break;
      }
    });
    
    if (trade.instrument) {
      trades.push(trade);
    }
  }
  
  return trades;
};

/**
 * Convert trades array to CSV string
 */
export const tradesToCSV = (trades) => {
  const headers = [
    'Date', 'Time', 'Instrument', 'Direction', 'Entry', 'Exit',
    'Stop Loss', 'Take Profit', 'Lot', 'Risk %', 'P/L', 'RR Ratio',
    'Strategy', 'Session', 'Confluence', 'Emotion', 'Mistake',
    'Lesson Learned', 'Notes', 'Tags',
  ];
  
  const rows = trades.map(t => [
    t.date || '', t.time || '', t.instrument || '', t.direction || '',
    t.entry || '', t.exit || '', t.stopLoss || '', t.takeProfit || '',
    t.lot || '', t.riskPercent || '', t.profitLoss || '', t.rrRatio || '',
    t.strategy || '', t.session || '', t.confluence || '', t.emotion || '',
    t.mistake || '', t.lessonLearned || '', 
    (t.notes || '').replace(/,/g, ';'),
    (t.tags || []).join(';'),
  ].join(','));
  
  return [headers.join(','), ...rows].join('\n');
};
