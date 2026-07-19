/**
 * GumiGenk Journal — Settings Context
 * App-wide settings state management
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@gumiGenk_settings';

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

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettingsState] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        if (saved) {
          setSettingsState({ ...defaultSettings, ...JSON.parse(saved) });
        }
      } catch (e) {
        // use defaults
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  const updateSettings = useCallback(async (updates) => {
    setSettingsState(prev => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const resetSettings = useCallback(async () => {
    setSettingsState(defaultSettings);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    } catch (e) {
      // silent
    }
  }, []);

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
