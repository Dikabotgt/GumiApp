/**
 * GumiGenk Journal — Dashboard Screen
 * Premium analytics dashboard with all trading metrics
 */

import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, Dimensions, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTrades } from '../../context/TradeContext';
import { calculateStats } from '../../utils/calculations';
import { formatCurrency, formatPercent, formatPL, formatNumber } from '../../utils/formatters';
import Card from '../../components/common/Card';
import AnimatedView from '../../components/common/AnimatedView';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonStat } from '../../components/common/Skeleton';
import CalendarHeatmap from '../../components/journal/CalendarHeatmap';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { colors, fontFamily, isDark } = useTheme();
  const { trades, isLoading } = useTrades();
  const [refreshing, setRefreshing] = useState(false);
  const [activeStatPeriod, setActiveStatPeriod] = useState('monthly');
  const [accountFilter, setAccountFilter] = useState('all');

  const filteredTrades = useMemo(() => {
    if (accountFilter === 'all') return trades;
    return trades.filter(t => (t.accountType || 'real') === accountFilter);
  }, [trades, accountFilter]);

  const stats = useMemo(() => calculateStats(filteredTrades), [filteredTrades]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
            Dashboard
          </Text>
        </View>
        <View style={styles.skeletonGrid}>
          {[1,2,3,4,5,6].map(i => (
            <SkeletonStat key={i} style={styles.skeletonItem} />
          ))}
        </View>
      </View>
    );
  }

  const statCards = [
    { label: 'Total Profit', value: formatCurrency(stats.totalProfit), icon: 'arrow-up-circle', color: colors.profit, bg: 'transparent' },
    { label: 'Total Loss', value: formatCurrency(stats.totalLoss), icon: 'arrow-down-circle', color: colors.loss, bg: 'transparent' },
    { label: 'Net Profit', value: formatPL(stats.netProfit), icon: 'wallet', color: stats.netProfit >= 0 ? colors.profit : colors.loss, bg: 'transparent' },
    { label: 'Win Rate', value: formatPercent(stats.winRate), icon: 'trophy', color: colors.accent, bg: 'transparent' },
    { label: 'Average RR', value: `${stats.avgRR.toFixed(2)}R`, icon: 'analytics', color: colors.info, bg: 'transparent' },
    { label: 'Best Trade', value: formatPL(stats.bestTrade), icon: 'star', color: colors.profit, bg: 'transparent' },
    { label: 'Worst Trade', value: formatPL(stats.worstTrade), icon: 'warning', color: colors.loss, bg: 'transparent' },
    { label: 'Average Win', value: formatCurrency(stats.avgWin), icon: 'trending-up', color: colors.profit, bg: 'transparent' },
    { label: 'Average Loss', value: formatCurrency(stats.avgLoss), icon: 'trending-down', color: colors.loss, bg: 'transparent' },
    { label: 'Profit Factor', value: stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2), icon: 'pulse', color: colors.accent, bg: 'transparent' },
    { label: 'Expectancy', value: formatPL(stats.expectancy), icon: 'bar-chart', color: stats.expectancy >= 0 ? colors.profit : colors.loss, bg: 'transparent' },
    { label: 'Current Streak', value: `${stats.currentStreak > 0 ? '+' : ''}${stats.currentStreak}`, icon: 'flame', color: stats.currentStreak >= 0 ? colors.profit : colors.loss, bg: 'transparent' },
    { label: 'Max Win Streak', value: `${stats.maxWinStreak}`, icon: 'rocket', color: colors.profit, bg: 'transparent' },
    { label: 'Max Lose Streak', value: `${stats.maxLoseStreak}`, icon: 'thunderstorm', color: colors.loss, bg: 'transparent' },
    { label: 'Max Drawdown', value: formatPercent(stats.maxDrawdown), icon: 'arrow-down', color: colors.loss, bg: 'transparent' },
  ];

  const periodStats = activeStatPeriod === 'monthly' ? stats.monthlyStats
    : activeStatPeriod === 'weekly' ? stats.weeklyStats
    : stats.dailyStats;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <AnimatedView animation="fadeSlideUp" delay={0}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.headerDate, { color: colors.textSecondary, fontFamily: fontFamily.bold, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }]}>
                ACCOUNT
              </Text>
              <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fontFamily.serif, fontWeight: '700' }]}>
                Overview.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable style={[styles.headerBtn, { backgroundColor: colors.card, borderRadius: 20 }]}>
                <Ionicons name="notifications-outline" size={18} color={colors.accent} />
              </Pressable>
              <Pressable
                onPress={() => {
                  const next = accountFilter === 'all' ? 'real' : accountFilter === 'real' ? 'funded' : accountFilter === 'funded' ? 'backtest' : 'all';
                  setAccountFilter(next);
                }}
                style={[styles.headerBtn, { backgroundColor: colors.card, borderRadius: 20 }]}
              >
                <Text style={{ color: colors.textPrimary, fontFamily: fontFamily.bold, fontSize: 13 }}>
                  N
                </Text>
              </Pressable>
            </View>
          </View>
        </AnimatedView>

        {trades.length === 0 ? (
          <EmptyState
            icon="bar-chart-outline"
            title="No Trading Data"
            subtitle="Add trades in the Journal tab to see your analytics here"
          />
        ) : (
          <>
            {/* Net P/L Hero Card */}
            <AnimatedView animation="fadeSlideUp" delay={100}>
              <Card variant="default" style={styles.heroCard}>
                <Text style={[styles.heroLabel, { color: colors.accent, fontFamily: fontFamily.medium }]}>
                  Net Profit/Loss
                </Text>
                <Text style={[
                  styles.heroValue,
                  { color: stats.netProfit >= 0 ? colors.profit : colors.loss, fontFamily: fontFamily.bold },
                ]}>
                  {formatPL(stats.netProfit)}
                </Text>
                <View style={styles.heroRow}>
                  <View style={styles.heroStat}>
                    <Text style={[styles.heroStatLabel, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>Win Rate</Text>
                    <Text style={[styles.heroStatValue, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                      {formatPercent(stats.winRate)}
                    </Text>
                  </View>
                  <View style={[styles.heroDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.heroStat}>
                    <Text style={[styles.heroStatLabel, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>Trades</Text>
                    <Text style={[styles.heroStatValue, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                      {stats.totalTrades}
                    </Text>
                  </View>
                  <View style={[styles.heroDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.heroStat}>
                    <Text style={[styles.heroStatLabel, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>Profit Factor</Text>
                    <Text style={[styles.heroStatValue, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                      {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </Card>
            </AnimatedView>

            {/* Win/Loss Summary Bar */}
            <AnimatedView animation="fadeSlideUp" delay={200}>
              <Card style={styles.winLossBar}>
                <View style={styles.winLossHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                    Win / Loss Distribution
                  </Text>
                </View>
                <View style={styles.barContainer}>
                  <View style={[
                    styles.barWin,
                    {
                      backgroundColor: colors.profit,
                      flex: stats.winCount || 1,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }
                  ]} />
                  {stats.breakEvenCount > 0 && (
                    <View style={[styles.barBE, { backgroundColor: colors.textTertiary, flex: stats.breakEvenCount }]} />
                  )}
                  <View style={[
                    styles.barLoss,
                    {
                      backgroundColor: colors.loss,
                      flex: stats.lossCount || 1,
                      borderTopRightRadius: 6,
                      borderBottomRightRadius: 6,
                    }
                  ]} />
                </View>
                <View style={styles.barLabels}>
                  <Text style={[styles.barLabel, { color: colors.profit, fontFamily: fontFamily.medium }]}>
                    {stats.winCount}W ({formatPercent(stats.winRate, 0)})
                  </Text>
                  <Text style={[styles.barLabel, { color: colors.loss, fontFamily: fontFamily.medium }]}>
                    {stats.lossCount}L ({formatPercent(100 - stats.winRate, 0)})
                  </Text>
                </View>
              </Card>
            </AnimatedView>

            {/* Stat Cards Grid */}
            <AnimatedView animation="fadeSlideUp" delay={300}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold, paddingHorizontal: 16, marginBottom: 12 }]}>
                Performance Metrics
              </Text>
            </AnimatedView>
            <View style={styles.grid}>
              {statCards.map((stat, index) => (
                <AnimatedView
                  key={stat.label}
                  animation="fadeSlideUp"
                  delay={350 + index * 40}
                  style={styles.gridItem}
                >
                  <Card style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>
                      <Ionicons name={stat.icon} size={18} color={stat.color} />
                    </View>
                    <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
                      {stat.label}
                    </Text>
                    <Text style={[styles.statValue, { color: stat.color, fontFamily: fontFamily.bold }]} numberOfLines={1}>
                      {stat.value}
                    </Text>
                  </Card>
                </AnimatedView>
              ))}
            </View>

            {/* Equity Curve */}
            {stats.equityCurve.length > 1 && (
              <AnimatedView animation="fadeSlideUp" delay={600}>
                <Card style={styles.chartCard}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                    Equity Curve
                  </Text>
                  <View style={styles.miniChart}>
                    {stats.equityCurve.map((point, index) => {
                      const maxY = Math.max(...stats.equityCurve.map(p => Math.abs(p.y)));
                      const normalizedY = maxY > 0 ? (point.y / maxY) * 60 : 0;
                      return (
                        <View
                          key={index}
                          style={[
                            styles.chartBar,
                            {
                              height: Math.abs(normalizedY) + 2,
                              backgroundColor: point.y >= 0 ? colors.profit : colors.loss,
                              marginBottom: point.y >= 0 ? 0 : undefined,
                              width: Math.max(2, (SCREEN_WIDTH - 96) / stats.equityCurve.length - 1),
                            },
                          ]}
                        />
                      );
                    })}
                  </View>
                  <View style={styles.chartLabels}>
                    <Text style={[styles.chartLabel, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
                      First Trade
                    </Text>
                    <Text style={[styles.chartLabel, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
                      Latest Trade
                    </Text>
                  </View>
                </Card>
              </AnimatedView>
            )}

            {/* Win Loss Pie Chart */}
            <AnimatedView animation="fadeSlideUp" delay={630}>
              <Card style={styles.chartCard}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold, marginBottom: 12 }]}>
                  Win Loss Ratio (Pie Chart)
                </Text>
                <View style={styles.pieContainer}>
                  <View style={[
                    styles.donutOuter,
                    {
                      borderColor: colors.border,
                      borderTopColor: stats.winRate >= 25 ? colors.profit : colors.loss,
                      borderRightColor: stats.winRate >= 50 ? colors.profit : colors.loss,
                      borderBottomColor: stats.winRate >= 75 ? colors.profit : colors.loss,
                      borderLeftColor: stats.winRate >= 95 ? colors.profit : colors.loss,
                    }
                  ]}>
                    <View style={[styles.donutInner, { backgroundColor: colors.card }]}>
                      <Text style={[styles.donutPercent, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
                        {stats.winRate.toFixed(0)}%
                      </Text>
                      <Text style={[styles.donutSub, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
                        Win Rate
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.pieLegend}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendColor, { backgroundColor: colors.profit }]} />
                      <Text style={[styles.legendText, { color: colors.textPrimary, fontFamily: fontFamily.medium }]}>
                        Wins: {stats.winCount} ({formatPercent(stats.winRate, 0)})
                      </Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendColor, { backgroundColor: colors.loss }]} />
                      <Text style={[styles.legendText, { color: colors.textPrimary, fontFamily: fontFamily.medium }]}>
                        Losses: {stats.lossCount} ({formatPercent(100 - stats.winRate, 0)})
                      </Text>
                    </View>
                    {stats.breakEvenCount > 0 && (
                      <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: colors.textTertiary }]} />
                        <Text style={[styles.legendText, { color: colors.textPrimary, fontFamily: fontFamily.medium }]}>
                          Break Even: {stats.breakEvenCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            </AnimatedView>

            {/* Performance Chart */}
            {stats.monthlyStats && stats.monthlyStats.length > 0 && (
              <AnimatedView animation="fadeSlideUp" delay={660}>
                <Card style={styles.chartCard}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold, marginBottom: 12 }]}>
                    Monthly Performance (Chart)
                  </Text>
                  <View style={styles.performanceChartContainer}>
                    {stats.monthlyStats.slice(0, 6).reverse().map((m, idx) => {
                      const maxNet = Math.max(...stats.monthlyStats.map(s => Math.abs(s.netPL))) || 1;
                      const barHeight = Math.max(10, (Math.abs(m.netPL) / maxNet) * 80);
                      const isProfit = m.netPL >= 0;
                      
                      return (
                        <View key={m.period} style={styles.perfCol}>
                          <Text style={[
                            styles.perfValueText,
                            {
                              color: isProfit ? colors.profit : colors.loss,
                              fontFamily: fontFamily.semiBold,
                              fontSize: 10,
                            }
                          ]}>
                            {m.netPL >= 0 ? '+' : '-'}${Math.round(Math.abs(m.netPL))}
                          </Text>
                          <View style={styles.perfBarWrapper}>
                            <View style={[
                              styles.perfBar,
                              {
                                height: barHeight,
                                backgroundColor: isProfit ? colors.profit : colors.loss,
                                borderTopLeftRadius: 4,
                                borderTopRightRadius: 4,
                              }
                            ]} />
                          </View>
                          <Text style={[styles.perfLabelText, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
                            {m.period.split('-')[1]}/{m.period.split('-')[0].substring(2)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </Card>
              </AnimatedView>
            )}

            {/* Session Heatmap */}
            {stats.sessionStats && stats.sessionStats.some(s => s.trades > 0) && (
              <AnimatedView animation="fadeSlideUp" delay={680}>
                <Card style={styles.chartCard}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold, marginBottom: 12 }]}>
                    Session Heatmap
                  </Text>
                  <View style={styles.sessionGrid}>
                    {stats.sessionStats.filter(s => s.trades > 0).map((session, idx) => {
                      const isProfit = session.netPL >= 0;
                      return (
                        <View key={session.name} style={[styles.sessionBox, { backgroundColor: isProfit ? colors.profitLight : colors.lossLight, borderColor: isProfit ? colors.profit : colors.loss }]}>
                          <Text style={[styles.sessionName, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                            {session.name}
                          </Text>
                          <Text style={[styles.sessionWinRate, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>
                            {session.winRate.toFixed(0)}% Win
                          </Text>
                          <Text style={[styles.sessionPL, { color: isProfit ? colors.profit : colors.loss, fontFamily: fontFamily.bold }]}>
                            {formatPL(session.netPL)}
                          </Text>
                        </View>
                      )
                    })}
                  </View>
                </Card>
              </AnimatedView>
            )}

            {/* Period Statistics */}
            <AnimatedView animation="fadeSlideUp" delay={700}>
              <Card style={styles.periodCard}>
                <View style={styles.periodHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                    Period Statistics
                  </Text>
                </View>
                <View style={styles.periodTabs}>
                  {['monthly', 'weekly', 'daily'].map((period) => (
                    <Pressable
                      key={period}
                      onPress={() => setActiveStatPeriod(period)}
                      style={[
                        styles.periodTab,
                        {
                          backgroundColor: activeStatPeriod === period ? colors.accentLight : 'transparent',
                          borderRadius: 8,
                        },
                      ]}
                    >
                      <Text style={[
                        styles.periodTabText,
                        {
                          color: activeStatPeriod === period ? colors.accent : colors.textSecondary,
                          fontFamily: activeStatPeriod === period ? fontFamily.semiBold : fontFamily.regular,
                        },
                      ]}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {periodStats.length === 0 ? (
                  <Text style={[styles.noData, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
                    No data for this period
                  </Text>
                ) : (
                  periodStats.slice(0, 10).map((period, index) => (
                    <View
                      key={period.period}
                      style={[
                        styles.periodRow,
                        { borderBottomColor: colors.divider },
                        index === Math.min(periodStats.length, 10) - 1 && { borderBottomWidth: 0 },
                      ]}
                    >
                      <Text style={[styles.periodDate, { color: colors.textPrimary, fontFamily: fontFamily.medium }]}>
                        {period.period}
                      </Text>
                      <View style={styles.periodStats}>
                        <Text style={[styles.periodStat, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
                          {period.trades} trades
                        </Text>
                        <Badge
                          label={formatPercent(period.winRate, 0)}
                          variant={period.winRate >= 50 ? 'profit' : 'loss'}
                          size="xs"
                        />
                        <Text style={[
                          styles.periodPL,
                          {
                            color: period.netPL >= 0 ? colors.profit : colors.loss,
                            fontFamily: fontFamily.semiBold,
                          },
                        ]}>
                          {formatPL(period.netPL)}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </Card>
            </AnimatedView>

            {/* Recent Trades */}
            <AnimatedView animation="fadeSlideUp" delay={800}>
              <Card style={styles.recentCard}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                  Recent Trades
                </Text>
                {trades.slice(0, 5).map((trade, index) => (
                  <View
                    key={trade.id || index}
                    style={[styles.recentRow, { borderBottomColor: colors.divider }]}
                  >
                    <View style={styles.recentLeft}>
                      <Badge
                        label={trade.direction || 'N/A'}
                        variant={trade.direction === 'BUY' ? 'buy' : 'sell'}
                        size="xs"
                      />
                      <Text style={[styles.recentInstrument, { color: colors.textPrimary, fontFamily: fontFamily.medium }]}>
                        {trade.instrument || 'Unknown'}
                      </Text>
                    </View>
                    <Text style={[
                      styles.recentPL,
                      {
                        color: (trade.profitLoss || 0) >= 0 ? colors.profit : colors.loss,
                        fontFamily: fontFamily.semiBold,
                      },
                    ]}>
                      {formatPL(trade.profitLoss || 0)}
                    </Text>
                  </View>
                ))}
              </Card>
            </AnimatedView>

            {/* Trading Calendar */}
            <AnimatedView animation="fadeSlideUp" delay={900}>
              <Card style={[styles.recentCard, { marginTop: 16 }]}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold, marginBottom: 12 }]}>
                  Trading Calendar
                </Text>
                <CalendarHeatmap 
                  trades={filteredTrades} 
                  onDayPress={(dateStr) => {
                    navigation.navigate('Journal', { searchDate: dateStr });
                  }} 
                />
              </Card>
            </AnimatedView>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 20,
  },
  heroLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 32,
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  heroStatValue: {
    fontSize: 16,
  },
  heroDivider: {
    width: 1,
    height: 30,
  },
  winLossBar: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  winLossHeader: {
    marginBottom: 12,
  },
  barContainer: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barWin: {},
  barBE: {},
  barLoss: {},
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  barLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  gridItem: {
    width: '50%',
    padding: 4,
  },
  statCard: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  statIcon: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
  },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    marginTop: 12,
    gap: 1,
  },
  chartBar: {
    borderRadius: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 10,
  },
  periodCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  periodHeader: {
    marginBottom: 12,
  },
  periodTabs: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 4,
  },
  periodTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  periodTabText: {
    fontSize: 13,
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  periodDate: {
    fontSize: 13,
  },
  periodStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodStat: {
    fontSize: 12,
  },
  periodPL: {
    fontSize: 13,
    minWidth: 60,
    textAlign: 'right',
  },
  noData: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 13,
  },
  recentCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentInstrument: {
    fontSize: 14,
  },
  recentPL: {
    fontSize: 14,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  skeletonItem: {
    width: '48%',
    marginBottom: 8,
  },
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  donutOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPercent: {
    fontSize: 20,
  },
  donutSub: {
    fontSize: 9,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  pieLegend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
  },
  performanceChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 12,
    paddingBottom: 4,
  },
  perfCol: {
    alignItems: 'center',
    flex: 1,
  },
  perfValueText: {
    fontSize: 9,
    marginBottom: 4,
  },
  perfBarWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    width: 16,
    backgroundColor: 'rgba(128,128,128,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  perfBar: {
    width: '100%',
  },
  perfLabelText: {
    fontSize: 10,
    marginTop: 6,
  },
  sessionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sessionBox: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  sessionName: {
    fontSize: 14,
    marginBottom: 4,
  },
  sessionWinRate: {
    fontSize: 12,
    marginBottom: 4,
  },
  sessionPL: {
    fontSize: 15,
  },
});

export default DashboardScreen;
