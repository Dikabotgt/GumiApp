/**
 * GumiGenk Journal — Storage Utilities (Supabase Migration)
 */

import { supabase } from '../lib/supabase';

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Map DB snake_case to JS camelCase
const mapToJS = (dbTrade) => ({
  id: dbTrade.id,
  instrument: dbTrade.instrument,
  direction: dbTrade.direction,
  entry: dbTrade.entry,
  exit: dbTrade.exit,
  stopLoss: dbTrade.stop_loss,
  takeProfit: dbTrade.take_profit,
  lot: dbTrade.lot,
  riskPercent: dbTrade.risk_percent,
  profitLoss: dbTrade.profit_loss,
  rrRatio: dbTrade.rr_ratio,
  outcome: dbTrade.outcome,
  strategy: dbTrade.strategy,
  session: dbTrade.session,
  confluence: dbTrade.confluence || '',
  emotion: dbTrade.emotion,
  mistake: dbTrade.mistake,
  lessonLearned: dbTrade.lesson_learned,
  notes: dbTrade.notes,
  tags: dbTrade.tags || [],
  images: dbTrade.images || [],
  accountType: dbTrade.account_type,
  date: dbTrade.date,
  time: dbTrade.time,
  createdAt: dbTrade.created_at,
  updatedAt: dbTrade.updated_at,
});

// Map JS camelCase to DB snake_case
const mapToDB = (jsTrade, userId) => ({
  id: jsTrade.id,
  user_id: userId,
  instrument: jsTrade.instrument,
  direction: jsTrade.direction,
  entry: jsTrade.entry || null,
  exit: jsTrade.exit || null,
  stop_loss: jsTrade.stopLoss || null,
  take_profit: jsTrade.takeProfit || null,
  lot: jsTrade.lot || null,
  risk_percent: jsTrade.riskPercent || null,
  profit_loss: jsTrade.profitLoss || null,
  rr_ratio: jsTrade.rrRatio || null,
  outcome: jsTrade.outcome || null,
  strategy: jsTrade.strategy || null,
  session: jsTrade.session || null,
  confluence: jsTrade.confluence || null,
  emotion: jsTrade.emotion || null,
  mistake: jsTrade.mistake || null,
  lesson_learned: jsTrade.lessonLearned || null,
  notes: jsTrade.notes || null,
  tags: jsTrade.tags || null,
  images: jsTrade.images || null,
  account_type: jsTrade.accountType || null,
  date: jsTrade.date || null,
  time: jsTrade.time || null,
});

export const loadTrades = async (userId) => {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data ? data.map(mapToJS) : [];
  } catch (error) {
    console.error('Failed to load trades from Supabase:', error);
    return [];
  }
};

export const saveTrades = async (trades, userId) => {
  if (!userId) return;
  try {
    // 1. Get existing IDs to find what was deleted locally
    const { data: existing } = await supabase.from('trades').select('id').eq('user_id', userId);
    const existingIds = existing ? existing.map(e => e.id) : [];
    
    const newIds = trades.map(t => t.id);
    const idsToDelete = existingIds.filter(id => !newIds.includes(id));
    
    // 2. Delete removed trades
    if (idsToDelete.length > 0) {
      await supabase.from('trades').delete().in('id', idsToDelete).eq('user_id', userId);
    }
    
    // 3. Upsert current trades
    if (trades.length > 0) {
      const dbTrades = trades.map(t => mapToDB(t, userId));
      const { error } = await supabase.from('trades').upsert(dbTrades, { onConflict: 'id' });
      if (error) throw error;
    }
  } catch (error) {
    console.error('Failed to save trades to Supabase:', error);
  }
};

export const createBackup = async (userId) => {
  try {
    const trades = await loadTrades(userId);
    const { data: settings } = await supabase.from('user_profiles').select('*').eq('user_id', userId).single();
    
    const backup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      trades,
      settings: settings || {},
    };
    return JSON.stringify(backup, null, 2);
  } catch (error) {
    console.error('Failed to create backup:', error);
    return null;
  }
};

export const restoreBackup = async (backupJson, userId) => {
  try {
    const backup = JSON.parse(backupJson);
    if (backup.trades) {
      await saveTrades(backup.trades, userId);
    }
    if (backup.settings) {
      // Direct upsert to user_profiles if needed, though SettingsContext usually handles it
      await supabase.from('user_profiles').upsert({ ...backup.settings, user_id: userId });
    }
    return true;
  } catch (error) {
    console.error('Failed to restore backup:', error);
    return false;
  }
};

export const clearAllData = async (userId) => {
  try {
    await supabase.from('trades').delete().eq('user_id', userId);
    // Note: We don't delete user_profile to avoid breaking constraints, just reset to defaults in SettingsContext
    return true;
  } catch (error) {
    console.error('Failed to clear data:', error);
    return false;
  }
};
