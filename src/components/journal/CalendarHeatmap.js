import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { formatPL } from '../../utils/formatters';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarHeatmap = ({ trades, onDayPress }) => {
  const { colors, fontFamily, borderRadius: br } = useTheme();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const { calendarDays, monthStats } = useMemo(() => {
    // Process trades by date string (YYYY-MM-DD)
    const tradesByDate = {};
    let totalPL = 0;
    let winCount = 0;
    let lossCount = 0;

    trades.forEach(t => {
      if (!t.date) return;
      const d = new Date(t.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
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

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push({ empty: true, key: `empty-${i}` });
    }
    
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
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
  }, [trades, year, month]);

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

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

      <View style={[styles.statsRow, { backgroundColor: colors.card, borderRadius: br.md }]}>
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
              return <View key={item.key} style={styles.dayCell} />;
            }
            
            const hasData = !!item.data;
            const isProfit = hasData && item.data.pnl >= 0;
            const isLoss = hasData && item.data.pnl < 0;
            
            let bgColor = colors.surface;
            let borderColor = 'transparent';
            
            if (isProfit) {
              bgColor = colors.profitLight;
              borderColor = colors.profit;
            } else if (isLoss) {
              bgColor = colors.lossLight;
              borderColor = colors.loss;
            } else if (hasData) {
              // Break even
              bgColor = colors.cardElevated;
              borderColor = colors.textTertiary;
            }
            
            return (
              <Pressable
                key={item.key}
                onPress={() => hasData && onDayPress && onDayPress(item.fullDate)}
                style={[
                  styles.dayCell, 
                  styles.activeDayCell,
                  { backgroundColor: bgColor, borderColor, borderRadius: br.sm }
                ]}
              >
                <Text style={[
                  styles.dateText, 
                  { 
                    color: hasData ? colors.textPrimary : colors.textSecondary,
                    fontFamily: hasData ? fontFamily.bold : fontFamily.regular,
                  }
                ]}>
                  {item.date}
                </Text>
                {hasData && (
                  <View style={[
                    styles.indicatorDot, 
                    { backgroundColor: isProfit ? colors.profit : isLoss ? colors.loss : colors.textTertiary }
                  ]} />
                )}
              </Pressable>
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
  dayCell: {
    width: '14.28%', // 100/7
    aspectRatio: 1,
    padding: 2,
  },
  activeDayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dateText: {
    fontSize: 14,
  },
  indicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 6,
  }
});

export default CalendarHeatmap;
