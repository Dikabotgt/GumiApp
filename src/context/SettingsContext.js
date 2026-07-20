/**
 * GumiGenk Journal — Settings Context
 * App-wide settings state management (Supabase Migration)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const defaultSettings = {
  language: 'en',
  currency: 'USD',
  defaultLotSize: 0.01,
  defaultRiskPercent: 1,
  accountBalance: 0,
  leverage: 100,
  notificationsEnabled: true,
  showProfitInPips: false,
  defaultSession: 'London',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
};

// Map DB snake_case to JS camelCase
const mapSettingsToJS = (db) => ({
  language: db.language || 'en',
  currency: db.currency || 'USD',
  defaultLotSize: db.default_lot_size ?? 0.01,
  defaultRiskPercent: db.default_risk_percent ?? 1,
  accountBalance: db.account_balance ?? 0,
  leverage: db.leverage ?? 100,
  notificationsEnabled: db.notifications_enabled ?? true,
  showProfitInPips: db.show_profit_in_pips ?? false,
  defaultSession: db.default_session || 'London',
  dateFormat: db.date_format || 'YYYY-MM-DD',
  timeFormat: db.time_format || '24h',
});

// Map JS camelCase to DB snake_case
const mapSettingsToDB = (settings, userId) => ({
  user_id: userId,
  language: settings.language,
  currency: settings.currency,
  default_lot_size: settings.defaultLotSize,
  default_risk_percent: settings.defaultRiskPercent,
  account_balance: settings.accountBalance,
  leverage: settings.leverage,
  notifications_enabled: settings.notificationsEnabled,
  show_profit_in_pips: settings.showProfitInPips,
  default_session: settings.defaultSession,
  date_format: settings.dateFormat,
  time_format: settings.timeFormat,
});

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettingsState] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setSettingsState(defaultSettings);
        setIsLoaded(true);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (data && !error) {
          setSettingsState({ ...defaultSettings, ...mapSettingsToJS(data) });
        } else {
          setSettingsState(defaultSettings);
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    
    load();
  }, [user]);

  const updateSettings = useCallback(async (updates) => {
    setSettingsState(prev => {
      const next = { ...prev, ...updates };
      
      if (user) {
        const dbSettings = mapSettingsToDB(next, user.id);
        supabase.from('user_profiles').upsert(dbSettings).then(({ error }) => {
          if (error) console.error('Failed to save settings:', error);
        });
      }
      
      return next;
    });
  }, [user]);

  const resetSettings = useCallback(async () => {
    setSettingsState(defaultSettings);
    if (user) {
      const dbSettings = mapSettingsToDB(defaultSettings, user.id);
      await supabase.from('user_profiles').upsert(dbSettings);
    }
  }, [user]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
