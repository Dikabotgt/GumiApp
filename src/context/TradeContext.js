/**
 * GumiGenk Journal — Trade Context
 * State management for trading journal data
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadTrades, saveTrades, generateId } from '../utils/storage';
import { useAuth } from './AuthContext';

const TradeContext = createContext();

// Action types
const ACTIONS = {
  SET_TRADES: 'SET_TRADES',
  ADD_TRADE: 'ADD_TRADE',
  UPDATE_TRADE: 'UPDATE_TRADE',
  DELETE_TRADE: 'DELETE_TRADE',
  BULK_IMPORT: 'BULK_IMPORT',
  SET_LOADING: 'SET_LOADING',
};

const initialState = {
  trades: [],
  isLoading: true,
};

function tradeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TRADES:
      return { ...state, trades: action.payload, isLoading: false };
    
    case ACTIONS.ADD_TRADE: {
      const newTrade = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { ...state, trades: [newTrade, ...state.trades] };
    }
    
    case ACTIONS.UPDATE_TRADE: {
      const updatedTrades = state.trades.map(trade =>
        trade.id === action.payload.id
          ? { ...trade, ...action.payload, updatedAt: new Date().toISOString() }
          : trade
      );
      return { ...state, trades: updatedTrades };
    }
    
    case ACTIONS.DELETE_TRADE:
      return {
        ...state,
        trades: state.trades.filter(trade => trade.id !== action.payload),
      };
    
    case ACTIONS.BULK_IMPORT:
      return {
        ...state,
        trades: [
          ...action.payload.map(t => ({
            ...t,
            id: t.id || generateId(),
            createdAt: t.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
          ...state.trades,
        ],
      };
    
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
}

export const TradeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tradeReducer, initialState);
  const { user } = useAuth(); // Getting the user_id dynamically from session

  // Load trades from storage when user session is available
  useEffect(() => {
    const load = async () => {
      if (!user) {
        dispatch({ type: ACTIONS.SET_TRADES, payload: [] });
        return;
      }
      
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const storedTrades = await loadTrades(user.id);
      
      if (storedTrades && storedTrades.length > 0) {
        dispatch({ type: ACTIONS.SET_TRADES, payload: storedTrades });
      } else {
        dispatch({ type: ACTIONS.SET_TRADES, payload: [] });
      }
    };
    load();
  }, [user]);

  // Persist trades to Supabase whenever local state changes
  useEffect(() => {
    if (!state.isLoading && user) {
      saveTrades(state.trades, user.id);
    }
  }, [state.trades, state.isLoading, user]);

  const addTrade = useCallback((trade) => {
    dispatch({ type: ACTIONS.ADD_TRADE, payload: trade });
  }, []);

  const updateTrade = useCallback((trade) => {
    dispatch({ type: ACTIONS.UPDATE_TRADE, payload: trade });
  }, []);

  const deleteTrade = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_TRADE, payload: id });
  }, []);

  const bulkImport = useCallback((trades) => {
    dispatch({ type: ACTIONS.BULK_IMPORT, payload: trades });
  }, []);

  const value = {
    trades: state.trades,
    isLoading: state.isLoading,
    addTrade,
    updateTrade,
    deleteTrade,
    bulkImport,
  };

  return (
    <TradeContext.Provider value={value}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};

export default TradeContext;
