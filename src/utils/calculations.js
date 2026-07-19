/**
 * GumiGenk Journal — Trading Calculations Engine
 * Computes all dashboard metrics from trade data
 */

/**
 * Calculate all dashboard statistics from trades array
 */
export const calculateStats = (trades) => {
  if (!trades || trades.length === 0) {
    return getEmptyStats();
  }

  const completedTrades = trades.filter(t => t.profitLoss !== undefined && t.profitLoss !== null);
  
  if (completedTrades.length === 0) {
    return getEmptyStats();
  }

  const wins = completedTrades.filter(t => t.outcome === 'win' || (t.outcome !== 'loss' && t.outcome !== 'be' && t.profitLoss > 0));
  const losses = completedTrades.filter(t => t.outcome === 'loss' || (t.outcome !== 'win' && t.outcome !== 'be' && t.profitLoss < 0));
  const breakEven = completedTrades.filter(t => t.outcome === 'be' || (t.outcome !== 'win' && t.outcome !== 'loss' && t.profitLoss === 0));

  const totalProfit = wins.reduce((sum, t) => sum + t.profitLoss, 0);
  const totalLoss = Math.abs(losses.reduce((sum, t) => sum + t.profitLoss, 0));
  const netProfit = totalProfit - totalLoss;
  
  const winRate = (wins.length / completedTrades.length) * 100;
  
  const avgWin = wins.length > 0 ? totalProfit / wins.length : 0;
  const avgLoss = losses.length > 0 ? totalLoss / losses.length : 0;
  
  const avgRR = completedTrades
    .filter(t => t.rrRatio !== undefined && t.rrRatio !== null)
    .reduce((sum, t, _, arr) => sum + t.rrRatio / arr.length, 0);

  const bestTrade = Math.max(...completedTrades.map(t => t.profitLoss));
  const worstTrade = Math.min(...completedTrades.map(t => t.profitLoss));

  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
  
  // Expectancy = (Win% × Avg Win) - (Loss% × Avg Loss)
  const winPercent = wins.length / completedTrades.length;
  const lossPercent = losses.length / completedTrades.length;
  const expectancy = (winPercent * avgWin) - (lossPercent * avgLoss);

  // Streaks
  const { currentStreak, maxWinStreak, maxLoseStreak } = calculateStreaks(completedTrades);

  // Maximum Drawdown
  const maxDrawdown = calculateMaxDrawdown(completedTrades);

  // Equity Curve
  const equityCurve = calculateEquityCurve(completedTrades);

  // Performance by period
  const monthlyStats = calculatePeriodStats(completedTrades, 'month');
  const weeklyStats = calculatePeriodStats(completedTrades, 'week');
  const dailyStats = calculatePeriodStats(completedTrades, 'day');
  
  // Session Stats for Heatmap
  const sessionStats = calculateSessionStats(completedTrades);

  return {
    totalTrades: completedTrades.length,
    totalProfit,
    totalLoss,
    netProfit,
    winRate,
    avgRR,
    bestTrade,
    worstTrade,
    avgWin,
    avgLoss,
    profitFactor,
    expectancy,
    currentStreak,
    maxWinStreak,
    maxLoseStreak,
    maxDrawdown,
    equityCurve,
    winCount: wins.length,
    lossCount: losses.length,
    breakEvenCount: breakEven.length,
    monthlyStats,
    weeklyStats,
    dailyStats,
    sessionStats,
  };
};

/**
 * Calculate win/loss streaks
 */
const calculateStreaks = (trades) => {
  let currentStreak = 0;
  let maxWinStreak = 0;
  let maxLoseStreak = 0;
  let tempWinStreak = 0;
  let tempLoseStreak = 0;

  // Sort by date
  const sorted = [...trades].sort((a, b) => {
    const dateA = new Date(a.date + ' ' + (a.time || '00:00'));
    const dateB = new Date(b.date + ' ' + (b.time || '00:00'));
    return dateA - dateB;
  });

  sorted.forEach(trade => {
    const isWin = trade.outcome === 'win' || (trade.outcome !== 'loss' && trade.outcome !== 'be' && trade.profitLoss > 0);
    const isLoss = trade.outcome === 'loss' || (trade.outcome !== 'win' && trade.outcome !== 'be' && trade.profitLoss < 0);

    if (isWin) {
      tempWinStreak++;
      tempLoseStreak = 0;
      maxWinStreak = Math.max(maxWinStreak, tempWinStreak);
    } else if (isLoss) {
      tempLoseStreak++;
      tempWinStreak = 0;
      maxLoseStreak = Math.max(maxLoseStreak, tempLoseStreak);
    } else {
      tempWinStreak = 0;
      tempLoseStreak = 0;
    }
  });

  // Current streak based on last trades
  if (sorted.length > 0) {
    const lastTrade = sorted[sorted.length - 1];
    if (lastTrade.profitLoss > 0) {
      currentStreak = tempWinStreak;
    } else if (lastTrade.profitLoss < 0) {
      currentStreak = -tempLoseStreak;
    }
  }

  return { currentStreak, maxWinStreak, maxLoseStreak };
};

/**
 * Calculate maximum drawdown percentage
 */
const calculateMaxDrawdown = (trades) => {
  let peak = 0;
  let cumulative = 0;
  let maxDD = 0;

  const sorted = [...trades].sort((a, b) => {
    const dateA = new Date(a.date + ' ' + (a.time || '00:00'));
    const dateB = new Date(b.date + ' ' + (b.time || '00:00'));
    return dateA - dateB;
  });

  sorted.forEach(trade => {
    cumulative += trade.profitLoss;
    if (cumulative > peak) {
      peak = cumulative;
    }
    const drawdown = peak > 0 ? ((peak - cumulative) / peak) * 100 : 0;
    maxDD = Math.max(maxDD, drawdown);
  });

  return maxDD;
};

/**
 * Calculate equity curve data points
 */
const calculateEquityCurve = (trades) => {
  let cumulative = 0;
  const sorted = [...trades].sort((a, b) => {
    const dateA = new Date(a.date + ' ' + (a.time || '00:00'));
    const dateB = new Date(b.date + ' ' + (b.time || '00:00'));
    return dateA - dateB;
  });

  return sorted.map((trade, index) => {
    cumulative += trade.profitLoss;
    return {
      x: index,
      y: cumulative,
      date: trade.date,
      label: `Trade ${index + 1}`,
    };
  });
};

/**
 * Calculate statistics grouped by period (day, week, month)
 */
const calculatePeriodStats = (trades, period) => {
  const groups = {};

  trades.forEach(trade => {
    const date = new Date(trade.date);
    let key;

    switch (period) {
      case 'day':
        key = trade.date;
        break;
      case 'week': {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        key = startOfWeek.toISOString().split('T')[0];
        break;
      }
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = trade.date;
    }

    if (!groups[key]) {
      groups[key] = {
        period: key,
        trades: 0,
        wins: 0,
        losses: 0,
        profit: 0,
        loss: 0,
        netPL: 0,
      };
    }

    groups[key].trades++;
    const isWin = trade.outcome === 'win' || (trade.outcome !== 'loss' && trade.outcome !== 'be' && trade.profitLoss > 0);
    const isLoss = trade.outcome === 'loss' || (trade.outcome !== 'win' && trade.outcome !== 'be' && trade.profitLoss < 0);

    if (isWin) {
      groups[key].wins++;
      groups[key].profit += trade.profitLoss;
    } else if (isLoss) {
      groups[key].losses++;
      groups[key].loss += Math.abs(trade.profitLoss);
    }
    groups[key].netPL += trade.profitLoss;
  });

  return Object.values(groups)
    .map(g => ({
      ...g,
      winRate: g.trades > 0 ? (g.wins / g.trades) * 100 : 0,
    }))
    .sort((a, b) => b.period.localeCompare(a.period));
};

/**
 * Calculate stats grouped by trading session
 */
const calculateSessionStats = (trades) => {
  const sessions = {
    'Asia': { name: 'Asia', trades: 0, wins: 0, netPL: 0 },
    'London': { name: 'London', trades: 0, wins: 0, netPL: 0 },
    'New York': { name: 'New York', trades: 0, wins: 0, netPL: 0 },
    'NY Overlap': { name: 'NY Overlap', trades: 0, wins: 0, netPL: 0 },
    'Sydney': { name: 'Sydney', trades: 0, wins: 0, netPL: 0 },
    'Off-Market': { name: 'Off-Market', trades: 0, wins: 0, netPL: 0 },
  };

  trades.forEach(trade => {
    if (trade.session && sessions[trade.session]) {
      const s = sessions[trade.session];
      s.trades++;
      s.netPL += (trade.profitLoss || 0);
      const isWin = trade.outcome === 'win' || (trade.outcome !== 'loss' && trade.outcome !== 'be' && trade.profitLoss > 0);
      if (isWin) s.wins++;
    }
  });

  return Object.values(sessions).map(s => ({
    ...s,
    winRate: s.trades > 0 ? (s.wins / s.trades) * 100 : 0
  }));
};

/**
 * Get empty stats object
 */
const getEmptyStats = () => ({
  totalTrades: 0,
  totalProfit: 0,
  totalLoss: 0,
  netProfit: 0,
  winRate: 0,
  avgRR: 0,
  bestTrade: 0,
  worstTrade: 0,
  avgWin: 0,
  avgLoss: 0,
  profitFactor: 0,
  expectancy: 0,
  currentStreak: 0,
  maxWinStreak: 0,
  maxLoseStreak: 0,
  maxDrawdown: 0,
  equityCurve: [],
  winCount: 0,
  lossCount: 0,
  breakEvenCount: 0,
  monthlyStats: [],
  weeklyStats: [],
  dailyStats: [],
  sessionStats: [],
});
