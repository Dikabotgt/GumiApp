import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { formatPL } from '../../utils/formatters';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarHeatmap = ({ trades, onDayPress }) => {
  const { colors, fontFamily, borderRadius: br } = useTheme();
  
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  const { calendarDays, monthStats } = useMemo(() => {
    // Process trades by date string (YYYY-MM-DD)
    const tradesByDate = {};
    let totalPL = 0;
    let winCount = 0;
    let lossCount = 0;

    trades.forEach(t => {
      if (!t.date || typeof t.date !== 'string') return;
      
      // Parse manual to avoid timezone issues (YYYY-MM-DD)
      const parts = t.date.split('-');
      if (parts.length < 3) return;
      const tYear = parseInt(parts[0], 10);
      const tMonth = parseInt(parts[1], 10) - 1;
      
      if (tYear === calYear && tMonth === calMonth) {
        const dateStr = t.date;
        if (!tradesByDate[dateStr]) {
          tradesByDate[dateStr] = { count: 0, pnl: 0, wins: 0, losses: 0, trades: [] };
        }
        tradesByDate[dateStr].count++;
        tradesByDate[dateStr].pnl += (t.profitLoss || 0);
        tradesByDate[dateStr].trades.push(t);
        
        totalPL += (t.profitLoss || 0);
        
        const isWin = t.outcome === 'win' || (t.outcome !== 'loss' && t.outcome !== 'be' && t.profitLoss > 0);
        const isLoss = t.outcome === 'loss' || (t.outcome !== 'win' && t.outcome !== 'be' && t.profitLoss < 0);
        
        if (isWin) {
          tradesByDate[dateStr].wins++;
          winCount++;
        } else if (isLoss) {
          tradesByDate[dateStr].losses++;
          lossCount++;
        }
      }
    });

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    
    const days = [];
    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push({ empty: true, key: `empty-${i}` });
    }
    
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayData = tradesByDate[dateStr];
      days.push({
        empty: false,
        date: d,
        fullDate: dateStr,
        key: dateStr,
        data: dayData,
      });
    }

    const winRate = (winCount + lossCount) > 0 ? (winCount / (winCount + lossCount)) * 100 : 0;

    return { 
      calendarDays: days,
      monthStats: { totalPL, winRate, count: winCount + lossCount }
    };
  }, [trades, calYear, calMonth]);

  const monthName = new Date(calYear, calMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handlePrevMonth} style={[styles.navBtn, { backgroundColor: colors.card }]}>
          <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={[styles.monthTitle, { color: colors.textPrimary, fontFamily: fontFamily.serif }]}>
          {monthName}
        </Text>
        <Pressable onPress={handleNextMonth} style={[styles.navBtn, { backgroundColor: colors.card }]}>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={[styles.statsRow, { backgroundColor: colors.glass, borderColor: colors.glassBorder, borderRadius: br.md }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textTertiary, fontFamily: fontFamily.medium }]}>Net PnL</Text>
          <Text style={[styles.statValue, { color: monthStats.totalPL >= 0 ? colors.profit : colors.loss, fontFamily: fontFamily.bold }]}>
            {formatPL(monthStats.totalPL)}
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textTertiary, fontFamily: fontFamily.medium }]}>Win Rate</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
            {monthStats.winRate.toFixed(0)}%
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textTertiary, fontFamily: fontFamily.medium }]}>Trades</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
            {monthStats.count}
          </Text>
        </View>
      </View>

      <View style={styles.calendarGrid}>
        {/* Days of week */}
        <View style={styles.weekRow}>
          {DAYS.map(day => (
            <Text key={day} style={[styles.dayHeader, { color: colors.textTertiary, fontFamily: fontFamily.medium }]}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar days */}
        <View style={styles.daysGrid}>
          {calendarDays.map((item, index) => {
            if (item.empty) {
              return (
                <View key={item.key} style={styles.dayCellWrapper}>
                  <View style={styles.emptyDayCell} />
                </View>
              );
            }
            
            const hasData = !!item.data;
            const isProfit = hasData && item.data.pnl >= 0;
            const isLoss = hasData && item.data.pnl < 0;
            
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const isToday = item.fullDate === todayStr;
            
            let bgColor = colors.surface;
            let borderColor = colors.border;
            let borderWidth = 1;
            
            if (isProfit) {
              bgColor = colors.profitLight;
              borderColor = colors.profit;
              borderWidth = 1.5;
            } else if (isLoss) {
              bgColor = colors.lossLight;
              borderColor = colors.loss;
              borderWidth = 1.5;
            } else if (hasData) {
              // Break even
              bgColor = colors.cardElevated;
              borderColor = colors.textTertiary;
              borderWidth = 1.5;
            }

            if (isToday) {
              borderColor = colors.accent;
              borderWidth = 1.5;
            }
            
            return (
              <View key={item.key} style={styles.dayCellWrapper}>
                <Pressable
                  onPress={() => hasData && onDayPress && onDayPress(item.fullDate)}
                  style={[
                    styles.activeDayCell,
                    { backgroundColor: bgColor, borderColor, borderWidth, borderRadius: br.md }
                  ]}
                >
                  <Text style={[
                    styles.dateText, 
                    { 
                      color: colors.textPrimary,
                      fontFamily: fontFamily.bold,
                    }
                  ]}>
                    {item.date}
                  </Text>
                  {hasData && (
                    <Text style={[
                      styles.pnlText,
                      { color: isProfit ? colors.profit : isLoss ? colors.loss : colors.textPrimary, fontFamily: fontFamily.bold }
                    ]} numberOfLines={1} adjustsFontSizeToFit>
                      {formatPL(item.data.pnl)}
                    </Text>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  statLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
  },
  calendarGrid: {
    width: '100%',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCellWrapper: {
    width: '14.28%', // 100/7
    aspectRatio: 1,
    padding: 2,
  },
  activeDayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyDayCell: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
  },
  pnlText: {
    fontSize: 9,
    position: 'absolute',
    bottom: 4,
    paddingHorizontal: 2,
  }
});

export default CalendarHeatmap;
