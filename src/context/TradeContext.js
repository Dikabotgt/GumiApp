/**
 * GumiGenk Journal — Trade Context
 * State management for trading journal data
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadTrades, saveTrades, generateId } from '../utils/storage';
import { sampleTrades } from '../data/sampleTrades';

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

  // Load trades from storage on mount
  useEffect(() => {
    const load = async () => {
      const storedTrades = await loadTrades();
      if (storedTrades && storedTrades.length > 0) {
        dispatch({ type: ACTIONS.SET_TRADES, payload: storedTrades });
      } else {
        dispatch({ type: ACTIONS.SET_TRADES, payload: sampleTrades });
      }
    };
    load();
  }, []);

  // Persist trades whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      saveTrades(state.trades);
    }
  }, [state.trades, state.isLoading]);

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
